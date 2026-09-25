import bcrypt from "bcrypt";
import userModel from "../../../db/models/user.model.js";
import { validateRegister } from "../auth/auth.validation.js";

const createEmployee = async (req, res) => {
  const userData = req.body;

  const errors = validateRegister(userData);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

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

  const hashedPassword = await bcrypt.hash(userData.password, 8);

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
  });

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
  const { position, role, salary, department, employmentStatus } = req.body;

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
      },
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
      },
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

const getEmployeesByActiveDepartment = async (req, res) => {
  try {
    const managerId = req.user?._id || req.user?.id;

    const manager = await userModel.findById(managerId).lean();

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    if (!manager.department) {
      return res.status(200).json({
        success: true,
        employees: [],
      });
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

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get employees by department error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    const { employmentStatus } = req.body;

    if (!["active", "inactive"].includes(employmentStatus)) {
      return res.status(400).json({
        success: false,
        message: "employmentStatus must be 'active' or 'inactive'",
      });
    }

    const managerId = req.user?._id || req.user?.id;
    const manager = await userModel.findById(managerId).lean();

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    const employee = await userModel.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (
      !manager.department ||
      employee.department?.toString() !== manager.department.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only manage employees in your own department",
      });
    }

    if (employee.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "You can only manage employees with the 'employee' role",
      });
    }

    employee.employmentStatus = employmentStatus;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: `Employee ${employmentStatus === "active" ? "activated" : "deactivated"} successfully`,
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
  } catch (error) {
    console.error("Update employee status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
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
