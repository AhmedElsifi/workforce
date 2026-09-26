import leaveRequestModel from "../../../db/models/leaveRequest.model.js";
import userModel from "../../../db/models/user.model.js";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const createLeaveRequest = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const employeeId = req.user?._id || req.user?.id || req.body.employeeId;

  if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
    throw new AppError(400, "All leave fields are required");
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new AppError(400, "End date must be after start date");
  }

  const existingLeave = await leaveRequestModel.findOne({
    employeeId,
    status: { $in: ["Pending", "Approved"] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) },
  });

  if (existingLeave) {
    throw new AppError(
      400,
      "You already have a pending or approved leave request for these dates",
    );
  }

  const newLeave = await leaveRequestModel.create({
    employeeId,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  await logActivity({
    action: "leave.create",
    category: "leave",
    performedBy: employeeId,
    targetType: "LeaveRequest",
    targetId: newLeave._id,
    description: `Submitted a ${leaveType} leave request`,
  });

  res.status(201).json({
    message: "Leave request submitted successfully",
    leave: newLeave,
  });
};

const getMyLeaveRequests = async (req, res) => {
  const employeeId = req.user?._id || req.user?.id;
  const requests = await leaveRequestModel
    .find({ employeeId })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(requests);
};

const getPendingLeaveRequests = async (req, res) => {
  const manager = await userModel
    .findById(req.user?._id || req.user?.id)
    .lean();

  const employeeIds = manager?.department
    ? await userModel.find({ department: manager.department }).distinct("_id")
    : [];

  const requests = await leaveRequestModel
    .find({ employeeId: { $in: employeeIds }, status: "Pending" })
    .populate("employeeId", "fname lname email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(requests);
};

const updateLeaveStatus = async (req, res) => {
  const { status, managerComment = "" } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    throw new AppError(400, "Status must be Approved or Rejected");
  }

  const request = await leaveRequestModel.findByIdAndUpdate(
    req.params.id,
    { status, managerComment },
    { new: true, runValidators: true },
  );

  if (!request) {
    throw new AppError(404, "Leave request not found");
  }

  await logActivity({
    action: "leave.status",
    category: "leave",
    performedBy: req.user?._id || req.user?.id,
    targetType: "LeaveRequest",
    targetId: request._id,
    description: `${status} a leave request`,
  });

  res.status(200).json({
    message: `Leave request ${status.toLowerCase()}`,
    leave: request,
  });
};

const getAllLeaveRequests = async (req, res) => {
  const manager = await userModel
    .findById(req.user?._id || req.user?.id)
    .lean();

  const employeeIds = manager?.department
    ? await userModel.find({ department: manager.department }).distinct("_id")
    : [];

  const requests = await leaveRequestModel
    .find({ employeeId: { $in: employeeIds } })
    .populate("employeeId", "fname lname email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(requests);
};

export {
  createLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus,
};