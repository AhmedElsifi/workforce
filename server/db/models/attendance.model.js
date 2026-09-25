import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workDate: {
      type: String,
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

export default attendanceModel;
attendanceSchema.index(
  { employee: 1, workDate: 1 },
  { unique: true },
);

const attendanceModel = mongoose.model(
  "Attendance",
  attendanceSchema,
);

export default attendanceModel;
