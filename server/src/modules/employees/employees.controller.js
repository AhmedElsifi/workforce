import userModel from "../../../db/models/user.model.js";

const getEmployees = async (req, res) => {
const { search, department, role, status } = req.query;
const filter = {};

if (department) filter.department = department;
if (role) filter.role = role;
if (status) filter.employmentStatus = status;
if (search) {
    filter.$or = [
    { fname: { $regex: search, $options: "i" } },
    { lname: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
    { position: { $regex: search, $options: "i" } },
    ];
}
const employees = await userModel.find(filter).select("-password").populate("department", "name");
return res.json({ success: true, employees });
};

const getEmployeeById = async (req, res) => {
const employee = await userModel.findById(req.params.id).select("-password").populate("department", "name");
if (!employee) {
    return res.status(404).json({ success: false, errors: { message: "Employee not found" } });
}
return res.json({ success: true, employee });
};

const updateEmployee = async (req, res) => {
const { position, role, salary, department, employmentStatus } = req.body;
const employee = await userModel
    .findByIdAndUpdate(req.params.id, { position, role, salary, department, employmentStatus }, { new: true })
    .select("-password");

if (!employee) {
    return res.status(404).json({ success: false, errors: { message: "Employee not found" } });
}
return res.json({ success: true, employee });
};
const deactivateEmployee = async (req, res) => {
const employee = await userModel
    .findByIdAndUpdate(req.params.id, { employmentStatus: "inactive" }, { new: true })
    .select("-password");

if (!employee) {
    return res.status(404).json({ success: false, errors: { message: "Employee not found" } });
}
return res.json({ success: true, employee });
};
export { getEmployees, getEmployeeById, updateEmployee, deactivateEmployee };