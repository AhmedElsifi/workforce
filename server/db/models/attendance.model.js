import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    clockIn: Date,
    clockOut: Date,
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
  },
  {
    timestamps: true,
  },
);

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

export default attendanceModel;
