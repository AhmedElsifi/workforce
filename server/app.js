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

dbConnection;

const app = express();

// Required on Vercel: trust the proxy so secure cookies + req.protocol behave correctly
app.set("trust proxy", 1);

// Exact origins allowed to call the API
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://iti-project-workforce.vercel.app",  // legacy
  "https://itiproject-workforce.vercel.app",   // <-- your real production frontend
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.trim().replace(/\/+$/, ""));
}

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Same-origin / curl / Postman requests have no Origin header — allow them.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

// Explicitly answer preflight requests (required for POST/PUT/PATCH with JSON body)
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(auditRoutes);
app.use(employeesRoutes);
app.use(departmentsRoutes);
app.use(leaveRoutes);
app.use(attendanceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}