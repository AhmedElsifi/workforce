import leaveRequestModel from "../../../db/models/leaveRequest.model.js";
import userModel from "../../../db/models/user.model.js";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid"];
const MAX_DURATION_DAYS = 30;
const MAX_REASON_LENGTH = 500;

const isIsoDateString = (v) => {
  if (typeof v !== "string" || !v.trim()) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const createLeaveRequest = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const employeeId = req.user?._id || req.user?.id || req.body.employeeId;

  const errors = {};

  if (!employeeId) errors.employeeId = "Employee is required";

  if (!leaveType) {
    errors.leaveType = "Leave type is required";
  } else if (!LEAVE_TYPES.includes(leaveType)) {
    errors.leaveType = `Leave type must be one of: ${LEAVE_TYPES.join(", ")}`;
  }

  if (!startDate) {
    errors.startDate = "Start date is required";
  } else if (!isIsoDateString(startDate)) {
    errors.startDate = "Start date must be a valid date";
  }

  if (!endDate) {
    errors.endDate = "End date is required";
  } else if (!isIsoDateString(endDate)) {
    errors.endDate = "End date must be a valid date";
  }

  if (!reason || typeof reason !== "string" || !reason.trim()) {
    errors.reason = "Reason is required";
  } else if (reason.trim().length > MAX_REASON_LENGTH) {
    errors.reason = `Reason must be at most ${MAX_REASON_LENGTH} characters`;
  }

  if (
    !errors.startDate &&
    !errors.endDate &&
    new Date(startDate) > new Date(endDate)
  ) {
    errors.endDate = "End date must be on or after the start date";
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, "Validation failed", errors);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Reject clearly-old leaves; keep today and future allowed.
  const today = startOfToday();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (end < oneYearAgo) {
    throw new AppError(400, "Validation failed", {
      endDate: "Cannot request leave older than one year",
    });
  }

  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24)) + 1;

  if (durationDays > MAX_DURATION_DAYS) {
    throw new AppError(400, "Validation failed", {
      endDate: `Leave cannot exceed ${MAX_DURATION_DAYS} days`,
    });
  }

  const overlapping = await leaveRequestModel.findOne({
    employeeId,
    status: { $in: ["Pending", "Approved"] },
    startDate: { $lte: end },
    endDate: { $gte: start },
  });

  if (overlapping) {
    throw new AppError(
      400,
      "Validation failed",
      {
        startDate:
          "You already have a pending or approved leave request for these dates",
      },
    );
  }

  const newLeave = await leaveRequestModel.create({
    employeeId,
    leaveType,
    startDate: start,
    endDate: end,
    reason: reason.trim(),
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
    success: true,
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
    throw new AppError(400, "Status must be Approved or Rejected", {
      status: "Status must be Approved or Rejected",
    });
  }

  if (typeof managerComment !== "string") {
    throw new AppError(400, "Validation failed", {
      managerComment: "Manager comment must be a string",
    });
  }

  if (managerComment.length > MAX_REASON_LENGTH) {
    throw new AppError(400, "Validation failed", {
      managerComment: `Manager comment must be at most ${MAX_REASON_LENGTH} characters`,
    });
  }

  const request = await leaveRequestModel.findByIdAndUpdate(
    req.params.id,
    { status, managerComment: managerComment.trim() },
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