import attendanceModel from "../../../db/models/attendance.model.js";
import userModel from "../../../db/models/user.model.js";
import departmentModel from "../../../db/models/department.model.js";
import { logActivity } from "../audit/audit.controller.js";
import { AppError } from "../../middlewares/errorHandler.js";

const getCairoWorkDate = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const checkIn = async (req, res) => {
  const employeeId = req.user._id;
  const now = new Date();
  const workDate = getCairoWorkDate(now);

  const existingAttendance = await attendanceModel.findOne({
    employee: employeeId,
    workDate,
  });

  if (existingAttendance) {
    throw new AppError(409, "Employee has already checked in today");
  }

  const attendance = await attendanceModel.create({
    employee: employeeId,
    workDate,
    checkIn: now,
  });

  await logActivity({
    action: "attendance.check-in",
    category: "attendance",
    performedBy: employeeId,
    targetType: "Attendance",
    targetId: attendance._id,
    description: `Checked in for ${workDate}`,
  });

  res.status(201).json({
    success: true,
    message: "Check-in successful",
    attendance: {
      id: attendance._id,
      workDate: attendance.workDate,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
    },
  });
};

const checkOut = async (req, res) => {
  const employeeId = req.user._id;
  const now = new Date();
  const workDate = getCairoWorkDate(now);

  const attendance = await attendanceModel.findOne({
    employee: employeeId,
    workDate,
  });

  if (!attendance) {
    throw new AppError(404, "No attendance record found for today");
  }

  if (attendance.checkOut) {
    throw new AppError(409, "Employee has already checked out today");
  }

  if (now <= attendance.checkIn) {
    throw new AppError(409, "Check-out time must be after check-in time");
  }

  attendance.checkOut = now;
  await attendance.save();

  await logActivity({
    action: "attendance.check-out",
    category: "attendance",
    performedBy: employeeId,
    targetType: "Attendance",
    targetId: attendance._id,
    description: `Checked out for ${workDate}`,
  });

  res.status(200).json({
    success: true,
    message: "Check-out successful",
    attendance: {
      id: attendance._id,
      workDate: attendance.workDate,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
    },
  });
};

const getAttendanceHistory = async (req, res) => {
  const employeeId = req.user._id;

  const attendanceHistory = await attendanceModel
    .find({ employee: employeeId })
    .select("workDate checkIn checkOut")
    .sort({ workDate: -1 });

  res.status(200).json({
    success: true,
    attendance: attendanceHistory.map((record) => ({
      id: record._id,
      workDate: record.workDate,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
    })),
  });
};

const getDepartmentAttendance = async (req, res) => {
  const managerId = req.user?._id || req.user?.id;
  const { date } = req.query;

  const department = await departmentModel
    .findOne({ manager: managerId })
    .lean();

  if (!department) {
    throw new AppError(404, "No department is assigned to this manager yet");
  }

  const employeeIds = await userModel
    .find({ department: department._id, role: "employee" })
    .distinct("_id");

  const query = { employee: { $in: employeeIds } };
  if (date) query.workDate = date;

  const records = await attendanceModel
    .find(query)
    .populate("employee", "fname lname position")
    .sort({ workDate: -1, checkIn: -1 })
    .lean();

  const formatted = records.map((record) => {
    let status = "present";

    if (!record.checkIn) {
      status = "absent";
    } else if (record.checkOut && record.checkIn) {
      const hours =
        (new Date(record.checkOut) - new Date(record.checkIn)) /
        (1000 * 60 * 60);
      if (hours < 8) status = "late";
    }

    return {
      _id: record._id,
      date: record.workDate,
      clockIn: record.checkIn,
      clockOut: record.checkOut,
      status,
      employee: record.employee,
    };
  });

  res.status(200).json({
    success: true,
    records: formatted,
  });
};

export { checkIn, checkOut, getAttendanceHistory, getDepartmentAttendance };