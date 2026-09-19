import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, lowercase: true, trim: true },
    lname: { type: String, lowercase: true, trim: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    position: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    salary: { type: Number, default: 0 },
    employmentStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
