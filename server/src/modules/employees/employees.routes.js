import express from "express";
import {
createEmployee,
getEmployees,
getEmployeeById,
updateEmployee,
deactivateEmployee,
} from "./employees.controller.js";
const employeesRoutes = express.Router();

employeesRoutes.use(express.json());
employeesRoutes.post("/employees", createEmployee);
employeesRoutes.get("/employees", getEmployees);
employeesRoutes.get("/employees/:id", getEmployeeById);
employeesRoutes.put("/employees/:id", updateEmployee);
employeesRoutes.patch(
"/employees/:id/deactivate",
deactivateEmployee
);
export { employeesRoutes };