import express from "express";
import dbConnection from "./db/dbConnection.js";
import { authRoutes } from "./src/modules/auth/auth.routes.js";
import { departmentsRoutes } from "./src/modules/departments/departments.routes.js";
import { employeesRoutes } from "./src/modules/employees/employees.routes.js";


dbConnection;

const app = express();

app.use(authRoutes);

//person4
app.use(departmentsRoutes);
app.use(employeesRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
