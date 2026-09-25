import attendanceModel from "../../../db/models/attendance.model.js";

const adminDashboard = (req, res) => {
  res.json({ message: "Success Admin" });
};

const employeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const [totalAttendanceDays, completedAttendanceDays] =
      await Promise.all([
        attendanceModel.countDocuments({
          employee: employeeId,
        }),

        attendanceModel.countDocuments({
          employee: employeeId,
          checkOut: { $ne: null },
        }),
      ]);

    const openAttendanceDays =
      totalAttendanceDays - completedAttendanceDays;

    return res.status(200).json({
      success: true,
      statistics: {
        totalAttendanceDays,
        completedAttendanceDays,
        openAttendanceDays,
      },
    });
  } catch (error) {
    console.error("Employee dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { adminDashboard, employeeDashboard };