import express from "express";
import checkId from "../../middlewares/checkId.js";
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
departmentsRoutes.get("/departments/:id", checkId, getDepartmentById);
departmentsRoutes.get(
  "/departments/:id/employees",
  checkId,
  getDepartmentEmployees,
);
departmentsRoutes.put("/departments/:id", checkId, updateDepartment);
departmentsRoutes.delete("/departments/:id", checkId, deleteDepartment);
export default departmentsRoutes;
