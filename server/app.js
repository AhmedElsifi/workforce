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

const app = express();

// Vercel terminates TLS in front of your function — trust the proxy
// so secure cookies and req.protocol behave correctly.
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://itiproject-workforce.vercel.app",
];

if (process.env.FRONTEND_URL) {
  const frontendUrl = process.env.FRONTEND_URL.trim().replace(/\/+$/, "");
  if (!allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
  }
}

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Wait for MongoDB to be ready before touching any route.
// Without this, the first request on a cold start will buffer for 10s and fail.
app.use(async (req, res, next) => {
  try {
    await dbConnection;
    next();
  } catch (err) {
    console.error("DB not ready for request:", err.message);
    next(err);
  }
});

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