import jwt from "jsonwebtoken";
import userModel from "../../../db/models/user.model.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const userData = req.body;
  const errors = validateRegister(userData);

  // checks whether there is errors or not:
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // exists?
  const existingUser = await userModel.findOne({
    email: userData.email.toLowerCase().trim(),
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      errors: {
        email: "Email already exists",
      },
    });
  }
  // hashing:
  const hashed = await bcrypt.hash(userData.password, 8);
  // save user:
  await userModel.insertOne({
    fname: userData.fname.trim(),
    lname: userData.lname.trim(),
    email: userData.email.toLowerCase().trim(),
    password: hashed,
  });
  //return success (later redirect to dashboard or login)
  return res
    .status(201)
    .json({ success: true, message: "user registered successfully" });
};

let login = async (req, res) => {
  const userData = req.body;
  const errors = validateLogin(userData);

  // checks whether there is errors or not:
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // exists?
  const existingUser = await userModel.findOne({
    email: userData.email.toLowerCase().trim(),
  });

  if (!existingUser) {
    return res.status(401).json({
      success: false,
      errors: {
        message: "Invalid email or password",
      },
    });
  }

  const validCredentials = await bcrypt.compare(
    userData.password,
    existingUser.password,
  );

  if (!validCredentials) {
    return res.status(401).json({
      success: false,
      errors: {
        message: "Invalid email or password",
      },
    });
  }

  const token = jwt.sign(
    {
      _id: existingUser._id,
      role: existingUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  if (existingUser.role === "admin") {
    return res.redirect("/pages/admin/dashboard.html");
  }

  if (existingUser.role === "manager") {
    return res.redirect("/pages/manager/dashboard.html");
  }

  return res.redirect("/pages/employee/dashboard.html");
};

let getCurrentUser = (req, res) => {};

let updateCurrentUser = (req, res) => {};

export { login, register, getCurrentUser, updateCurrentUser };
