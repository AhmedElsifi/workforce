import departmentModel from "../../../db/models/department.model.js";
import userModel from "../../../db/models/user.model.js";

const createDepartment = async (req, res) => {
const { name, description, manager } = req.body;
if (!name || !name.trim()) {
    return res.status(400).json({ success: false, errors: { name: "Department name is required" } });
}
const existing = await departmentModel.findOne({ name: name.trim() });
if (existing) {
    return res.status(409).json({ success: false, errors: { name: "Department already exists" } });
}
const department = await departmentModel.create({ name: name.trim(), description, manager });
return res.status(201).json({ success: true, department });
};
const getDepartments = async (req, res) => {
const departments = await departmentModel.find().populate("manager", "fname lname email");

const withHeadcount = await Promise.all(
    departments.map(async (dept) => {
    const headcount = await userModel.countDocuments({ department: dept._id });
    return { ...dept.toObject(), headcount };
    })
);
return res.json({ success: true, departments: withHeadcount });
};
const updateDepartment = async (req, res) => {
const { name, description, manager } = req.body;
const department = await departmentModel.findByIdAndUpdate(
    req.params.id,
    { name, description, manager },
    { new: true }
);
if (!department) {
    return res.status(404).json({ success: false, errors: { message: "Department not found" } });
}
return res.json({ success: true, department });
};

const deleteDepartment = async (req, res) => {
const activeEmployees = await userModel.countDocuments({ department: req.params.id });
if (activeEmployees > 0) {
    return res.status(409).json({ success: false, errors: { message: "Cannot delete a department with active employees" } });
}
const department = await departmentModel.findByIdAndDelete(req.params.id);
if (!department) {
    return res.status(404).json({ success: false, errors: { message: "Department not found" } });
}
return res.json({ success: true, message: "Department deleted" });
};

export { createDepartment, getDepartments, updateDepartment, deleteDepartment };