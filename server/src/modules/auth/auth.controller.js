import jwt from "jsonwebtoken";
import userModel from "../../../db/models/user.model.js";
import { validateCreds, validateLogin } from "./auth.validation.js";
import bcrypt from "bcrypt";

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
  const token = req.cookies.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded._id);

  res.json({
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    role: user.role,
    salary: user.salary,
    employmentStatus: user.employmentStatus,
  });
};

let updateCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded._id;
    const role = decoded.role;

    const { fname, lname, email, password, department, salary, status } =
      req.body;

    const updates = {};

    const credentials = {};

    if (fname !== undefined) credentials.fname = fname;
    if (lname !== undefined) credentials.lname = lname;
    if (email !== undefined) credentials.email = email;
    if (password !== undefined) credentials.password = password;

    if (Object.keys(credentials).length > 0) {
      const errors = validateCreds({
        fname: credentials.fname ?? "valid",
        lname: credentials.lname ?? "valid",
        email: credentials.email ?? "valid@email.com",
        password: credentials.password ?? "validpassword",
      });

      if (fname === undefined) delete errors.fname;
      if (lname === undefined) delete errors.lname;
      if (email === undefined) delete errors.email;
      if (password === undefined) delete errors.password;

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }
    }

    if (fname !== undefined) {
      updates.fname = fname.trim();
    }

    if (lname !== undefined) {
      updates.lname = lname.trim();
    }

    if (email !== undefined) {
      updates.email = email.trim().toLowerCase();

      const existingUser = await userModel.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          errors: {
            email: "Email is already in use",
          },
        });
      }
    }

    if (password !== undefined) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (role === "admin") {
      if (department !== undefined) updates.department = department;
      if (salary !== undefined) updates.salary = salary;
      if (status !== undefined) updates.status = status;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { login, getCurrentUser, updateCurrentUser };
