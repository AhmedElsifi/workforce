import attendanceModel from "../../../db/models/attendance.model.js";

const checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const now = new Date();

    const workDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const existingAttendance = await attendanceModel.findOne({
      employee: employeeId,
      workDate,
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message: "Employee has already checked in today",
      });
    }

    const attendance = await attendanceModel.create({
      employee: employeeId,
      workDate,
      checkIn: now,
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      attendance: {
        id: attendance._id,
        workDate: attendance.workDate,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const checkOut = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const now = new Date();

    const workDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const attendance = await attendanceModel.findOne({
      employee: employeeId,
      workDate,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for today",
      });
    }

    if (attendance.checkOut) {
      return res.status(409).json({
        success: false,
        message: "Employee has already checked out today",
      });
    }

    if (now <= attendance.checkIn) {
      return res.status(409).json({
        success: false,
        message: "Check-out time must be after check-in time",
      });
    }

    attendance.checkOut = now;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      attendance: {
        id: attendance._id,
        workDate: attendance.workDate,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
      },
    });
  } catch (error) {
    console.error("Check-out error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAttendanceHistory = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const attendanceHistory = await attendanceModel
      .find({
        employee: employeeId,
      })
      .select("workDate checkIn checkOut")
      .sort({ workDate: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceHistory.map((record) => ({
        id: record._id,
        workDate: record.workDate,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
      })),
    });
  } catch (error) {
    console.error("Attendance history error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export { checkIn, checkOut, getAttendanceHistory };