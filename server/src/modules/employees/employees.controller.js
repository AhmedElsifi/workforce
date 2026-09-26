import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../../../db/models/user.model.js";
import { validateRegister } from "../auth/auth.validation.js";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const validateEmployeeExtraFields = ({ position, department, salary }) => {
  const errors = {};

  if (position !== undefined && position !== null && position !== "") {
    if (typeof position !== "string") {
      errors.position = "Position must be a string";
    } else if (position.trim().length > 100) {
      errors.position = "Position must be at most 100 characters";
    }
  }

  if (department !== undefined && department !== null && department !== "") {
    if (!mongoose.isValidObjectId(department)) {
      errors.department = "Invalid department ID format";
    }
  }

  if (salary !== undefined && salary !== null && salary !== "") {
    const n = Number(salary);
    if (!Number.isFinite(n) || n < 0) {
      errors.salary = "Salary must be a non-negative number";
    }
  }

  return errors;
};

const createEmployee = async (req, res) => {
  const userData = req.body;

  const errors = validateRegister(userData);
  Object.assign(errors, validateEmployeeExtraFields(userData));

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, "Validation failed", errors);
  }

  if (userData.department) {
    const departmentExists = await mongoose
      .model("Department")
      .exists({ _id: userData.department });
    if (!departmentExists) {
      throw new AppError(400, "Validation failed", {
        department: "Selected department does not exist",
      });
    }
  }

  const existingUser = await userModel.findOne({
    email: userData.email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new AppError(409, "Validation failed", {
      email: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(userData.password, 8);

  const employee = await userModel.create({
    fname: userData.fname.trim(),
    lname: userData.lname.trim(),
    email: userData.email.toLowerCase().trim(),
    password: hashedPassword,
    role: "employee",
    position: userData.position,
    department: userData.department,
    salary: Number(userData.salary) || 0,
    employmentStatus: "active",
  });

  const employeeResponse = employee.toObject();
  delete employeeResponse.password;

  await logActivity({
    action: "employee.create",
    category: "employee",
    performedBy: req.user?._id,
    targetType: "User",
    targetId: employee._id,
    description: `Created employee ${employee.fname} ${employee.lname}`,
  });

  res.status(201).json({
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

  res.json({
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
    throw new AppError(404, "Employee not found");
  }

  res.json({
    success: true,
    employee,
  });
};

const updateEmployee = async (req, res) => {
  const { position, role, salary, department, employmentStatus } = req.body;

  const errors = {};

  if (role !== undefined && !["admin", "manager", "employee"].includes(role)) {
    errors.role = "Role must be admin, manager, or employee";
  }
  if (
    employmentStatus !== undefined &&
    !["active", "inactive"].includes(employmentStatus)
  ) {
    errors.employmentStatus = "Employment status must be active or inactive";
  }
  if (salary !== undefined && salary !== null && salary !== "") {
    const n = Number(salary);
    if (!Number.isFinite(n) || n < 0) {
      errors.salary = "Salary must be a non-negative number";
    }
  }
  if (department !== undefined && department !== null && department !== "") {
    if (!mongoose.isValidObjectId(department)) {
      errors.department = "Invalid department ID format";
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, "Validation failed", errors);
  }

  const employee = await userModel
    .findByIdAndUpdate(
      req.params.id,
      {
        position,
        role,
        salary: salary === undefined ? undefined : Number(salary),
        department,
        employmentStatus,
      },
      { new: true, runValidators: true },
    )
    .select("-password");

  if (!employee) {
    throw new AppError(404, "Employee not found");
  }

  await logActivity({
    action: "employee.update",
    category: "employee",
    performedBy: req.user?._id,
    targetType: "User",
    targetId: employee._id,
    description: `Updated employee ${employee.fname} ${employee.lname}`,
  });

  res.json({
    success: true,
    employee,
  });
};

const deactivateEmployee = async (req, res) => {
  const employee = await userModel
    .findByIdAndUpdate(
      req.params.id,
      { employmentStatus: "inactive" },
      { new: true },
    )
    .select("-password");

  if (!employee) {
    throw new AppError(404, "Employee not found");
  }

  await logActivity({
    action: "employee.deactivate",
    category: "employee",
    performedBy: req.user?._id,
    targetType: "User",
    targetId: employee._id,
    description: `Deactivated employee ${employee.fname} ${employee.lname}`,
  });

  res.json({
    success: true,
    employee,
  });
};

const getEmployeesByActiveDepartment = async (req, res) => {
  const managerId = req.user?._id || req.user?.id;
  const manager = await userModel.findById(managerId).lean();

  if (!manager) {
    throw new AppError(404, "Manager not found");
  }

  if (!manager.department) {
    return res.status(200).json({ success: true, employees: [] });
  }

  const employees = await userModel
    .find({
      department: manager.department,
      role: "employee",
      _id: { $ne: managerId },
    })
    .select("fname lname email role position salary employmentStatus")
    .sort({ fname: 1 })
    .lean();

  res.status(200).json({
    success: true,
    employees,
  });
};

const updateEmployeeStatus = async (req, res) => {
  const { employmentStatus } = req.body;

  if (!["active", "inactive"].includes(employmentStatus)) {
    throw new AppError(400, "employmentStatus must be 'active' or 'inactive'", {
      employmentStatus: "Employment status must be active or inactive",
    });
  }

  const managerId = req.user?._id || req.user?.id;
  const manager = await userModel.findById(managerId).lean();

  if (!manager) {
    throw new AppError(404, "Manager not found");
  }

  const employee = await userModel.findById(req.params.id);

  if (!employee) {
    throw new AppError(404, "Employee not found");
  }

  if (
    !manager.department ||
    employee.department?.toString() !== manager.department.toString()
  ) {
    throw new AppError(
      403,
      "You can only manage employees in your own department",
    );
  }

  if (employee.role !== "employee") {
    throw new AppError(
      403,
      "You can only manage employees with the 'employee' role",
    );
  }

  employee.employmentStatus = employmentStatus;
  await employee.save();

  await logActivity({
    action: "employee.status",
    category: "employee",
    performedBy: managerId,
    targetType: "User",
    targetId: employee._id,
    description: `Set ${employee.fname} ${employee.lname} to ${employmentStatus}`,
  });

  res.status(200).json({
    success: true,
    message: `Employee ${employmentStatus === "active" ? "activated" : "deactivated"
      } successfully`,
    employee: {
      _id: employee._id,
      fname: employee.fname,
      lname: employee.lname,
      email: employee.email,
      role: employee.role,
      position: employee.position,
      salary: employee.salary,
      employmentStatus: employee.employmentStatus,
    },
  });
};

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  getEmployeesByActiveDepartment,
  updateEmployeeStatus,
};