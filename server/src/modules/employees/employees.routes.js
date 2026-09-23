import express from "express";
import { getEmployees, getEmployeeById, updateEmployee, deactivateEmployee } from "./employees.controller.js";

export const employeesRoutes = express().router;
employeesRoutes.use(express.json());
employeesRoutes.get("/employees", getEmployees);
employeesRoutes.get("/employees/:id", getEmployeeById);
employeesRoutes.put("/employees/:id", updateEmployee);
employeesRoutes.patch("/employees/:id/deactivate", deactivateEmployee);