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
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
const departmentsRoutes = express.Router();

departmentsRoutes.use(express.json());
departmentsRoutes.post("/departments", authenticate, authorize("admin"), createDepartment);
departmentsRoutes.get("/departments", authenticate, authorize("admin", "manager"), getDepartments);
departmentsRoutes.get("/departments/:id", authenticate, authorize("admin", "manager"), checkId, getDepartmentById);
departmentsRoutes.get("/departments/:id/employees",
  authenticate,
  authorize("admin", "manager"),
  checkId,
  getDepartmentEmployees,
);
departmentsRoutes.put("/departments/:id", authenticate, authorize("admin"), checkId, updateDepartment);
departmentsRoutes.delete("/departments/:id", authenticate, authorize("admin"), checkId, deleteDepartment);
export default departmentsRoutes;
