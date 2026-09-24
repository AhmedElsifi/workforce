import LeaveRequest from "../../../db/models/leaveRequest.model.js";

// 1. Employee: Create a new leave request
const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user ? req.user.id : req.body.employeeId;

    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message:
          "employeeId, leaveType, startDate, endDate and reason are required",
      });
    }

    // End date must be after start date
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    // Check for overlapping pending/approved requests
    const existingLeave = await LeaveRequest.findOne({
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

    const newLeave = await LeaveRequest.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json({
      message: "Leave request submitted successfully",
      leave: newLeave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 2. Employee: Get my leave requests
const getMyLeaveRequests = async (req, res) => {
  try {
    const employeeId = req.user ? req.user.id : req.query.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId is required",
      });
    }

    const requests = await LeaveRequest.find({ employeeId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 3. Manager: Get pending leave requests
const getPendingLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({
      status: "Pending",
    })
      .populate("employeeId", "fname lname email position department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 4. Manager: Approve or Reject a leave request
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, managerComment } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leaveRequest.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending leave requests can be updated",
      });
    }

    leaveRequest.status = status;
    leaveRequest.managerComment = managerComment || "";

    await leaveRequest.save();

    return res.status(200).json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave: leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export {
  createLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  updateLeaveStatus,
};