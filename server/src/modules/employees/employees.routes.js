import express from "express";
import checkId from "../../middlewares/checkId.js";

import {
  employeeProfile,
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
} from "./employees.controller.js";

const employeesRoutes = express.Router();

employeesRoutes.use(express.json());

// Employee Management
employeesRoutes.post("/employees", createEmployee);

employeesRoutes.get("/employees", getEmployees);

employeesRoutes.get("/employees/:id", checkId, getEmployeeById);

employeesRoutes.put("/employees/:id", checkId, updateEmployee);

employeesRoutes.patch("/employees/:id/deactivate", checkId, deactivateEmployee);

// Employee profile from main
employeesRoutes.get("/employee/profile", employeeProfile);

export { employeesRoutes };
