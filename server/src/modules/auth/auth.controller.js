import jwt from "jsonwebtoken";
import userModel from "../../../db/models/user.model.js";
import {
  validateLogin,
  validateProfileUpdate,
  validateProfileUpdateAdmin,
} from "./auth.validation.js";
import bcrypt from "bcrypt";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const isProd = process.env.NODE_ENV === "production";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

const login = async (req, res) => {
  const userData = req.body;
  const errors = validateLogin(userData);

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, "Validation failed", errors);
  }

  const existingUser = await userModel.findOne({
    email: userData.email.toLowerCase().trim(),
  });

  if (!existingUser) {
    throw new AppError(401, "Invalid email or password");
  }

  const validCredentials = await bcrypt.compare(
    userData.password,
    existingUser.password,
  );

  if (!validCredentials) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { _id: existingUser._id, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie(COOKIE_NAME, token, cookieOptions);

  await logActivity({
    action: "auth.login",
    category: "auth",
    performedBy: existingUser._id,
    targetType: "User",
    targetId: existingUser._id,
    description: `${existingUser.fname} ${existingUser.lname} signed in`,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      name: `${existingUser.fname} ${existingUser.lname}`.trim(),
      role: existingUser.role,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select(
      "fname lname email role position salary employmentStatus department",
    )
    .populate("department", "name")
    .lean();

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.status(200).json({
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    role: user.role,
    position: user.position ?? null,
    salary: user.salary,
    employmentStatus: user.employmentStatus,
    department: user.department?.name ?? null,
  });
};

const updateCurrentUser = async (req, res) => {
  const employeeId = req.user._id;
  const userRole = req.user.role;

  const employeeAllowedFields = ["fname", "lname", "password"];
  const adminAllowedFields = [
    "fname",
    "lname",
    "email",
    "password",
    "role",
    "position",
    "department",
    "salary",
    "employmentStatus",
  ];

  const allowedFields =
    userRole === "admin" ? adminAllowedFields : employeeAllowedFields;

  const receivedFields = Object.keys(req.body);
  const invalidField = receivedFields.find(
    (field) => !allowedFields.includes(field),
  );

  if (invalidField) {
    throw new AppError(400, `Field '${invalidField}' cannot be updated`, {
      [invalidField]: `Field '${invalidField}' cannot be updated`,
    });
  }

  const validationErrors =
    userRole === "admin"
      ? validateProfileUpdateAdmin(req.body)
      : validateProfileUpdate(req.body);

  if (Object.keys(validationErrors).length > 0) {
    throw new AppError(400, "Validation failed", validationErrors);
  }

  const updates = {};

  if (req.body.fname !== undefined) updates.fname = req.body.fname.trim();
  if (req.body.lname !== undefined) updates.lname = req.body.lname.trim();

  if (req.body.password !== undefined && req.body.password !== "") {
    updates.password = await bcrypt.hash(req.body.password, 10);
  }

  if (userRole === "admin") {
    if (req.body.email !== undefined) updates.email = req.body.email.toLowerCase().trim();
    if (req.body.role !== undefined) updates.role = req.body.role;
    if (req.body.position !== undefined) updates.position = req.body.position;
    if (req.body.department !== undefined)
      updates.department = req.body.department;
    if (req.body.salary !== undefined) updates.salary = Number(req.body.salary);
    if (req.body.employmentStatus !== undefined)
      updates.employmentStatus = req.body.employmentStatus;
  }

  const user = await userModel
    .findByIdAndUpdate(employeeId, updates, {
      new: true,
      runValidators: true,
    })
    .select(
      "fname lname email position department role salary employmentStatus",
    );

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await logActivity({
    action: "auth.profile.update",
    category: "auth",
    performedBy: employeeId,
    targetType: "User",
    targetId: employeeId,
    description: `${user.fname} ${user.lname} updated their profile`,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};

const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export { login, getCurrentUser, updateCurrentUser, logout };