import bcrypt from "bcrypt";
import userModel from "../../../db/models/user.model.js";
import { validateRegister } from "../auth/auth.validation.js";
const createEmployee = async (req, res) => {
  const userData = req.body;
  // Validate employee data
  const errors = validateRegister(userData);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }
  // Check if email already exists
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
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 8);
  // Create employee
  const employee = await userModel.create({
    fname: userData.fname.trim(),
    lname: userData.lname.trim(),
    email: userData.email.toLowerCase().trim(),
    password: hashedPassword,
    role: "employee",
    position: userData.position,
    department: userData.department,
    salary: userData.salary || 0,
    employmentStatus: "active",
  })
  // Don't return password
  const employeeResponse = employee.toObject();
  delete employeeResponse.password;
  return res.status(201).json({
    success: true,
    employee: employeeResponse,
  });
};
const getEmployees = async (req, res) => {
  const { search, department, role, status } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (role) filter.role = role;
  if (status) filter.employmentStatus = status;
  if (search) {
    filter.$or = [
      { fname: { $regex: search, $options: "i" } },
      { lname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }
  const employees = await userModel
    .find(filter)
    .select("-password")
    .populate("department", "name");
  return res.json({
    success: true,
    employees,
  });
};
const getEmployeeById = async (req, res) => {
  const employee = await userModel
    .findById(req.params.id)
    .select("-password")
    .populate("department", "name");
  if (!employee) {
    return res.status(404).json({
      success: false,
      errors: {
        message: "Employee not found",
      },
    });
  }
  return res.json({
    success: true,
    employee,
  });
};
const updateEmployee = async (req, res) => {
  const {
    position,
    role,
    salary,
    department,
    employmentStatus,
  } = req.body;
  const employee = await userModel
    .findByIdAndUpdate(
      req.params.id,
      {
        position,
        role,
        salary,
        department,
        employmentStatus,
      },
      {
        new: true,
      }
    )
    .select("-password");

  if (!employee) {
    return res.status(404).json({
      success: false,
      errors: {
        message: "Employee not found",
      },
    });
  }

  return res.json({
    success: true,
    employee,
  });
};

const deactivateEmployee = async (req, res) => {
  const employee = await userModel
    .findByIdAndUpdate(
      req.params.id,
      {
        employmentStatus: "inactive",
      },
      {
        new: true,
      }
    )
    .select("-password");

  if (!employee) {
    return res.status(404).json({
      success: false,
      errors: {
        message: "Employee not found",
      },
    });
  }

  return res.json({
    success: true,
    employee,
  });
};
export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
};