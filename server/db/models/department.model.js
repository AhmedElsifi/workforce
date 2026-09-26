import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
  updatedAt: Date,
});

const departmentModel = mongoose.model("Department", departmentSchema);

export default departmentModel;
