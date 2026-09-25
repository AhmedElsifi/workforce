import express from "express";
import checkId from "../../middlewares/checkId.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  getEmployeesByActiveDepartment,
  updateEmployeeStatus,
} from "./employees.controller.js";

const employeesRoutes = express.Router();

employeesRoutes.use(express.json());

employeesRoutes.post("/employees", createEmployee);

employeesRoutes.get("/employees", getEmployees);

employeesRoutes.get("/employees/:id", checkId, getEmployeeById);

employeesRoutes.put("/employees/:id", checkId, updateEmployee);

employeesRoutes.patch("/employees/:id/deactivate", checkId, deactivateEmployee);

employeesRoutes.get(
  "/employees/department/my-team",
  authenticate,
  authorize("manager"),
  getEmployeesByActiveDepartment,
);

employeesRoutes.patch(
  "/employees/:id/status",
  authenticate,
  authorize("manager"),
  checkId,
  updateEmployeeStatus,
);

export default employeesRoutes;
