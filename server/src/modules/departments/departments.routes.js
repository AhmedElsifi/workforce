import express from "express";
import {
createDepartment,
getDepartments,
getDepartmentById,
getDepartmentEmployees,
updateDepartment,
deleteDepartment,
} from "./departments.controller.js";
const departmentsRoutes = express.Router();

departmentsRoutes.use(express.json());
departmentsRoutes.post("/departments", createDepartment);
departmentsRoutes.get("/departments", getDepartments);
departmentsRoutes.get("/departments/:id", getDepartmentById);
departmentsRoutes.get("/departments/:id/employees", getDepartmentEmployees);
departmentsRoutes.put("/departments/:id", updateDepartment);
departmentsRoutes.delete("/departments/:id", deleteDepartment);
export { departmentsRoutes };