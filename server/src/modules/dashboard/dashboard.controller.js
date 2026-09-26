import userModel from "../../../db/models/user.model.js";
import departmentModel from "../../../db/models/department.model.js";
import attendanceModel from "../../../db/models/attendance.model.js";
import leaveRequestModel from "../../../db/models/leaveRequest.model.js";
import auditModel from "../../../db/models/audit.model.js";
import { AppError } from "../../middlewares/errorHandler.js";

const getTodayWorkDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const adminDashboard = async (req, res) => {
  const [totalEmployees, activeEmployees, inactiveEmployees] =
    await Promise.all([
      userModel.countDocuments({}),
      userModel.countDocuments({ employmentStatus: "active" }),
      userModel.countDocuments({ employmentStatus: "inactive" }),
    ]);

  const departments = await departmentModel.find().lean();
  const departmentDistribution = await Promise.all(
    departments.map(async (dept) => ({
      _id: dept._id,
      name: dept.name,
      employeeCount: await userModel.countDocuments({ department: dept._id }),
    })),
  );

  const workDate = getTodayWorkDate();

  const presentToday = await attendanceModel.countDocuments({
    workDate,
    checkIn: { $ne: null },
  });

  const absentToday = Math.max(activeEmployees - presentToday, 0);

  const clockInRate =
    activeEmployees > 0
      ? Math.round((presentToday / activeEmployees) * 100)
      : 0;

  const pendingLeaveRequests = await leaveRequestModel.countDocuments({
    status: { $in: ["pending", "Pending"] },
  });

  const recentActivity = await auditModel
    .find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("performedBy", "fname lname role")
    .lean();

  res.status(200).json({
    success: true,
    kpis: { totalEmployees, activeEmployees, inactiveEmployees },
    departmentDistribution,
    attendanceOverview: { presentToday, absentToday, clockInRate },
    pendingLeaveRequests,
    recentActivity,
  });
};

const managerDashboard = async (req, res) => {
  const managerId = req.user._id;
  const department = await departmentModel
    .findOne({ manager: managerId })
    .lean();

  if (!department) {
    throw new AppError(404, "No department is assigned to this manager yet");
  }

  const [totalEmployees, activeEmployees, inactiveEmployees] =
    await Promise.all([
      userModel.countDocuments({
        department: department._id,
        role: "employee",
      }),
      userModel.countDocuments({
        department: department._id,
        role: "employee",
        employmentStatus: "active",
      }),
      userModel.countDocuments({
        department: department._id,
        role: "employee",
        employmentStatus: "inactive",
      }),
    ]);

  const departmentEmployeeIds = await userModel
    .find({ department: department._id, role: "employee" })
    .distinct("_id");

  const workDate = getTodayWorkDate();

  const presentToday = await attendanceModel.countDocuments({
    employee: { $in: departmentEmployeeIds },
    workDate,
    checkIn: { $ne: null },
  });

  const absentToday = Math.max(activeEmployees - presentToday, 0);

  const pendingLeaveRequests = await leaveRequestModel.countDocuments({
    employeeId: { $in: departmentEmployeeIds },
    status: { $in: ["pending", "Pending"] },
  });

  res.status(200).json({
    success: true,
    department: { _id: department._id, name: department.name },
    kpis: { totalEmployees, activeEmployees, inactiveEmployees },
    attendanceOverview: {
      presentToday,
      absentToday,
      clockInRate:
        activeEmployees > 0
          ? Math.round((presentToday / activeEmployees) * 100)
          : 0,
    },
    pendingLeaveRequests,
  });
};

const employeeDashboard = async (req, res) => {
  const employeeId = req.user._id;

  const [
    totalAttendanceDays,
    completedAttendanceDays,
    openAttendanceDays,
    pendingLeaveCount,
    totalLeaveRequests,
  ] = await Promise.all([
    attendanceModel.countDocuments({ employee: employeeId }),
    attendanceModel.countDocuments({
      employee: employeeId,
      checkOut: { $ne: null },
    }),
    attendanceModel.countDocuments({
      employee: employeeId,
      checkOut: null,
    }),
    leaveRequestModel.countDocuments({
      employeeId,
      status: { $in: ["pending", "Pending"] },
    }),
    leaveRequestModel.countDocuments({ employeeId }),
  ]);

  res.status(200).json({
    success: true,
    statistics: {
      totalAttendanceDays,
      completedAttendanceDays,
      openAttendanceDays,
    },
    pendingLeaveCount,
    totalLeaveRequests,
  });
};

export { adminDashboard, managerDashboard, employeeDashboard };