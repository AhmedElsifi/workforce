import userModel from "../../../db/models/user.model.js";
import validateRegister from "./auth.validation.js";
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

let login = (req, res) => {};

let getCurrentUser = (req, res) => {};

let updateCurrentUser = (req, res) => {};

export { login, register, getCurrentUser, updateCurrentUser };
