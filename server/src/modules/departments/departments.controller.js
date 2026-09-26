import mongoose from "mongoose";
import departmentModel from "../../../db/models/department.model.js";
import userModel from "../../../db/models/user.model.js";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const createDepartment = async (req, res) => {
  const { name, description, manager } = req.body;

  if (!name || !name.trim()) {
    throw new AppError(400, "Validation failed", {
      name: "Department name is required",
    });
  }

  const existing = await departmentModel.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });

  if (existing) {
    throw new AppError(409, "Validation failed", {
      name: "Department already exists",
    });
  }

  if (manager) {
    if (!mongoose.isValidObjectId(manager)) {
      throw new AppError(400, "Validation failed", {
        manager: "Invalid manager ID format",
      });
    }
    const managerExists = await userModel.findById(manager);
    if (!managerExists) {
      throw new AppError(404, "Validation failed", {
        manager: "Manager not found",
      });
    }
  }

  const department = await departmentModel.create({
    name: name.trim(),
    description,
    manager,
  });

  await logActivity({
    action: "department.create",
    category: "department",
    performedBy: req.user?._id,
    targetType: "Department",
    targetId: department._id,
    description: `Created department "${department.name}"`,
  });

  res.status(201).json({
    success: true,
    department,
  });
};

const getDepartments = async (req, res) => {
  const departments = await departmentModel
    .find()
    .populate("manager", "fname lname email");

  const withHeadcount = await Promise.all(
    departments.map(async (dept) => {
      const headcount = await userModel.countDocuments({
        department: dept._id,
        employmentStatus: "active",
      });
      return { ...dept.toObject(), headcount };
    }),
  );

  res.json({
    success: true,
    departments: withHeadcount,
  });
};

const getDepartmentById = async (req, res) => {
  const department = await departmentModel
    .findById(req.params.id)
    .populate("manager", "fname lname email");

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  const headcount = await userModel.countDocuments({
    department: department._id,
    employmentStatus: "active",
  });

  res.json({
    success: true,
    department: { ...department.toObject(), headcount },
  });
};

const getDepartmentEmployees = async (req, res) => {
  const department = await departmentModel.findById(req.params.id);
  if (!department) {
    throw new AppError(404, "Department not found");
  }

  const employees = await userModel
    .find({ department: req.params.id })
    .select("-password")
    .populate("department", "name");

  res.json({
    success: true,
    employees,
  });
};

const updateDepartment = async (req, res) => {
  const { name, description, manager } = req.body;

  if (!name || !name.trim()) {
    throw new AppError(400, "Validation failed", {
      name: "Department name is required",
    });
  }

  const existing = await departmentModel.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
    _id: { $ne: req.params.id },
  });

  if (existing) {
    throw new AppError(409, "Validation failed", {
      name: "Department already exists",
    });
  }

  if (manager) {
    if (!mongoose.isValidObjectId(manager)) {
      throw new AppError(400, "Validation failed", {
        manager: "Invalid manager ID format",
      });
    }
    const managerExists = await userModel.findById(manager);
    if (!managerExists) {
      throw new AppError(404, "Validation failed", {
        manager: "Manager not found",
      });
    }
  }

  const department = await departmentModel.findByIdAndUpdate(
    req.params.id,
    { name: name.trim(), description, manager },
    { new: true },
  );

  if (!department) {
    throw new AppError(404, "Department not found");
  }

  await logActivity({
    action: "department.update",
    category: "department",
    performedBy: req.user?._id,
    targetType: "Department",
    targetId: department._id,
    description: `Updated department "${department.name}"`,
  });

  res.json({
    success: true,
    department,
  });
};

const deleteDepartment = async (req, res) => {
  const activeEmployees = await userModel.countDocuments({
    department: req.params.id,
    employmentStatus: "active",
  });

  if (activeEmployees > 0) {
    throw new AppError(
      409,
      "Cannot delete a department with active employees",
    );
  }

  const department = await departmentModel.findByIdAndDelete(req.params.id);
  if (!department) {
    throw new AppError(404, "Department not found");
  }

  await logActivity({
    action: "department.delete",
    category: "department",
    performedBy: req.user?._id,
    targetType: "Department",
    targetId: department._id,
    description: `Deleted department "${department.name}"`,
  });

  res.json({
    success: true,
    message: "Department deleted",
  });
};

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentEmployees,
  updateDepartment,
  deleteDepartment,
};