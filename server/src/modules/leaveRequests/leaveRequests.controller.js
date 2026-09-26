import leaveRequestModel from "../../../db/models/leaveRequest.model.js";
import userModel from "../../../db/models/user.model.js";

const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user?._id || req.user?.id || req.body.employeeId;

    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All leave fields are required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const existingLeave = await leaveRequestModel.findOne({
      employeeId,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (existingLeave) {
      return res.status(400).json({
        message:
          "You already have a pending or approved leave request for these dates",
      });
    }

    const newLeave = new leaveRequestModel({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    return res.status(201).json({
      message: "Leave request submitted successfully",
      leave: newLeave,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getMyLeaveRequests = async (req, res) => {
  const employeeId = req.user?._id || req.user?.id;
  const requests = await leaveRequestModel
    .find({ employeeId })
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json(requests);
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
  return res.status(200).json(requests);
};

const updateLeaveStatus = async (req, res) => {
  const { status, managerComment = "" } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be Approved or Rejected" });
  }
  const request = await leaveRequestModel.findByIdAndUpdate(
    req.params.id,
    { status, managerComment },
    { new: true, runValidators: true },
  );
  if (!request)
    return res.status(404).json({ message: "Leave request not found" });
  return res
    .status(200)
    .json({ message: `Leave request ${status.toLowerCase()}`, leave: request });
};

const getAllLeaveRequests = async (req, res) => {
  try {
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

    return res.status(200).json(requests);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export {
  createLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus,
};
