import userModel from "../../../db/models/user.model.js";
import departmentModel from "../../../db/models/department.model.js";
import attendanceModel from "../../../db/models/attendance.model.js";
import leaveRequestModel from "../../../db/models/leaveRequest.model.js";
import auditModel from "../../../db/models/audit.model.js";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const adminDashboard = async (req, res) => {
  try {
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
        employeeCount: await userModel.countDocuments({
          department: dept._id,
        }),
      })),
    );

    const todayStart = startOfToday();
    const todayEnd = endOfToday();

    const [presentToday, markedToday] = await Promise.all([
      attendanceModel.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd },
        status: "present",
      }),
      attendanceModel.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    const absentToday = Math.max(markedToday - presentToday, 0);
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

    return res.status(200).json({
      success: true,
      kpis: { totalEmployees, activeEmployees, inactiveEmployees },
      departmentDistribution,
      attendanceOverview: { presentToday, absentToday, clockInRate },
      pendingLeaveRequests,
      recentActivity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

const managerDashboard = async (req, res) => {
  try {
    const managerId = req.user._id;
    const department = await departmentModel
      .findOne({ manager: managerId })
      .lean();

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "No department is assigned to this manager yet",
      });
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

    const todayStart = startOfToday();
    const todayEnd = endOfToday();

    const [presentToday, markedToday] = await Promise.all([
      attendanceModel.countDocuments({
        employee: { $in: departmentEmployeeIds },
        date: { $gte: todayStart, $lte: todayEnd },
        status: "present",
      }),
      attendanceModel.countDocuments({
        employee: { $in: departmentEmployeeIds },
        date: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    const pendingLeaveRequests = await leaveRequestModel.countDocuments({
      employeeId: { $in: departmentEmployeeIds },
      status: { $in: ["pending", "Pending"] },
    });

    return res.status(200).json({
      success: true,
      department: { _id: department._id, name: department.name },
      kpis: { totalEmployees, activeEmployees, inactiveEmployees },
      attendanceOverview: {
        presentToday,
        absentToday: Math.max(markedToday - presentToday, 0),
        clockInRate:
          activeEmployees > 0
            ? Math.round((presentToday / activeEmployees) * 100)
            : 0,
      },
      pendingLeaveRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load manager dashboard",
    });
  }
};

const employeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const todayStart = startOfToday();
    const todayEnd = endOfToday();

    const [todayAttendance, pendingLeaveCount, totalLeaveRequests] =
      await Promise.all([
        attendanceModel
          .findOne({
            employee: employeeId,
            date: { $gte: todayStart, $lte: todayEnd },
          })
          .lean(),
        leaveRequestModel.countDocuments({
          employeeId: employeeId,
          status: { $in: ["pending", "Pending"] },
        }),
        leaveRequestModel.countDocuments({ employeeId: employeeId }),
      ]);

    return res.status(200).json({
      success: true,
      clockedInToday: !!todayAttendance,
      pendingLeaveCount,
      totalLeaveRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load employee dashboard",
    });
  }
};

export { adminDashboard, managerDashboard, employeeDashboard };
