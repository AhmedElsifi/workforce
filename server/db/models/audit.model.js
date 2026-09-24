import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["employee", "department", "leave", "attendance", "auth", "system"],
      default: "system",
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetType: String,
    targetId: mongoose.Schema.Types.ObjectId,
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const auditModel = mongoose.model("Audit", auditSchema);

export default auditModel;
