import jwt from "jsonwebtoken";
import userModel from "../../../db/models/user.model.js";
import { validateCreds, validateLogin } from "./auth.validation.js";
import bcrypt from "bcrypt";

let login = async (req, res) => {
  const userData = req.body;
  const errors = validateLogin(userData);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

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

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      name: existingUser.name,
      role: existingUser.role,
    },
  });
};

let getCurrentUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("fname lname email role position salary employmentStatus");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      position: user.position ?? null,
      salary: user.salary,
      employmentStatus: user.employmentStatus,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
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
      return res.status(400).json({
        success: false,
        message: `Field '${invalidField}' cannot be updated`,
      });
    }

    const updates = {};

    if (req.body.fname !== undefined) {
      updates.fname = req.body.fname;
    }

    if (req.body.lname !== undefined) {
      updates.lname = req.body.lname;
    }

    if (req.body.password !== undefined && req.body.password !== "") {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (userRole === "admin") {
      if (req.body.email !== undefined) {
        updates.email = req.body.email;
      }

      if (req.body.role !== undefined) {
        updates.role = req.body.role;
      }

      if (req.body.position !== undefined) {
        updates.position = req.body.position;
      }

      if (req.body.department !== undefined) {
        updates.department = req.body.department;
      }

      if (req.body.salary !== undefined) {
        updates.salary = req.body.salary;
      }

      if (req.body.employmentStatus !== undefined) {
        updates.employmentStatus = req.body.employmentStatus;
      }
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
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { login, getCurrentUser, updateCurrentUser, logout };
