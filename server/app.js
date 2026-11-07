import express from "express";
import "dotenv/config";
import dbConnection from "./db/dbConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./src/modules/auth/auth.routes.js";
import departmentsRoutes from "./src/modules/departments/departments.routes.js";
import employeesRoutes from "./src/modules/employees/employees.routes.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes.js";
import auditRoutes from "./src/modules/audit/audit.routes.js";
import attendanceRoutes from "./src/modules/attendance/attendance.routes.js";
import leaveRoutes from "./src/modules/leaveRequests/leaveRequests.routes.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import { seedData } from "./DB seeder.js";

dbConnection;

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",                 // Vite dev server
  "https://iti-project-workforce.vercel.app", // existing deployed frontend
];

// Add the Vercel frontend URL from environment variable
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(auditRoutes);
app.use(employeesRoutes);
app.use(departmentsRoutes);
app.use(leaveRoutes);
app.use(attendanceRoutes);

// seedData(); // Uncomment only if you need to seed on first deploy

app.use(notFound);
app.use(errorHandler);

// Export the app for Vercel serverless
export default app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}