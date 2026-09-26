import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import { fileURLToPath } from "url";

import User from "./db/models/user.model.js";
import Department from "./db/models/department.model.js";
import Attendance from "./db/models/attendance.model.js";
import Audit from "./db/models/audit.model.js";
import LeaveRequest from "./db/models/leaveRequest.model.js";

// ---------- helpers ----------

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const chance = (p) => Math.random() < p;

const toCairoWorkDate = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const randomDateInLast = (days) => {
  const now = Date.now();
  const offset = rand(0, days * 24 * 60 - 1);
  return new Date(now - offset * 60 * 1000);
};

const step = (label) => console.log(`\n== ${label} ==`);

// ---------- name pools ----------

const FIRST_NAMES = [
  "Omar", "Sara", "Ali", "Nour", "Youssef", "Layla", "Khaled", "Hana",
  "Mostafa", "Farah", "Tarek", "Aya", "Hassan", "Dina", "Karim", "Rana",
  "Mahmoud", "Salma", "Yara", "Hoda", "Amr", "Nada", "Ziad", "Reem",
  "Basel", "Lina", "Fady", "Mai", "Sherif", "Nourhan", "Mohamed", "Heba",
  "Ibrahim", "Dalia", "Adel", "Rania", "Wael", "Ghada", "Emad", "Rasha",
  "Maged", "Nermin", "Sameh", "Doaa", "Ehab", "Marwa", "Hany", "Yasmin",
  "Ahmed", "Mona", "Hazem", "Hala", "Bassem", "Noha", "Anas", "Eman",
  "Rami", "Menna", "Tamer", "Soha", "Seif", "Nesma", "Ayman", "Shaimaa",
];

const LAST_NAMES = [
  "Hassan", "Mohamed", "Ibrahim", "Ali", "Mahmoud", "Youssef", "Sayed",
  "Abdallah", "Mostafa", "Farouk", "Kamal", "Fathy", "Gaber", "Hosny",
  "Ismail", "Khalil", "Lotfy", "Mansour", "Nabil", "Osman", "Rashad",
  "Sabry", "Shawky", "Zaki", "Zayed", "Adly", "Amin", "Barakat", "Darwish",
  "Eid", "Fawzy", "Hafez", "Helmy", "Ramadan", "Salama", "Soliman",
  "Sultan", "Taha", "Wahba", "Younis", "Fahmy", "Ghanem", "Hegazy",
  "Mekawy", "Rifaat", "Shehata", "Tawfik", "Zeidan",
];

const POSITIONS = [
  "Software Engineer", "Senior Software Engineer", "Backend Developer",
  "Frontend Developer", "Full Stack Developer", "DevOps Engineer",
  "QA Engineer", "HR Specialist", "HR Generalist", "Recruiter",
  "Sales Executive", "Account Manager", "Sales Representative",
  "Marketing Specialist", "Content Writer", "SEO Specialist",
  "Graphic Designer", "Product Manager", "Business Analyst",
  "Customer Success Representative", "Support Engineer",
];

const LEAVE_REASONS = [
  "Family vacation", "Medical appointment", "Feeling unwell",
  "Personal matters", "Rest and recovery", "Traveling abroad",
  "Family emergency", "Moving to a new apartment",
  "Attending a wedding", "Doctor's note provided",
  "Child is sick", "Mental health day", "Pre-scheduled surgery",
  "Bereavement", "Visiting relatives",
];

const MANAGER_COMMENTS = [
  "Approved. Enjoy your time off.",
  "Rejected. We need coverage that week.",
  "Approved, please hand off tasks before you leave.",
  "Sorry, cannot approve due to project deadline.",
  "Approved. Feel better soon.",
  "Please reschedule if possible.",
  "Fine, but make sure your tickets are updated.",
  "Not approved. We are short-staffed.",
];

// ---------- seeding pipeline ----------

export const seedData = async () => {
  if (!process.env.MONGO_DB_CONNECTION_STRING) {
    throw new Error(
      "MONGO_DB_CONNECTION_STRING is missing. Check your .env file.",
    );
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Refusing to run the seeder in production (NODE_ENV=production).",
    );
  }

  step("Connecting to MongoDB");
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  console.log("Connected to:", mongoose.connection.name);


  step("Rebuilding model indexes");
  await Promise.all([
    User.init(),
    Department.init(),
    Attendance.init(),
    Audit.init(),
    LeaveRequest.init(),
  ]);
  console.log("Indexes ready.");

  const password = await bcrypt.hash("123456", 10);

  // ---------------- departments ----------------
  step("Creating 4 departments");
  const departments = await Department.insertMany([
    { name: "Engineering", description: "Software development and infrastructure" },
    { name: "Human Resources", description: "People operations and talent" },
    { name: "Sales", description: "Revenue and client relationships" },
    { name: "Marketing", description: "Brand, content, and growth" },
  ]);
  console.log(`Created ${departments.length} departments.`);

  // ---------------- users ----------------
  step("Generating 100 users (2 admins, 4 managers, 94 employees)");

  const usedEmails = new Set();

  const makeEmail = (fname, lname) => {
    const base = `${fname}.${lname}`.toLowerCase();
    let email = `${base}@workforce.com`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${base}${counter}@workforce.com`;
      counter++;
    }
    usedEmails.add(email);
    return email;
  };

  const makeName = () => ({
    fname: pick(FIRST_NAMES),
    lname: pick(LAST_NAMES),
  });

  const usersToInsert = [];

  for (let i = 0; i < 2; i++) {
    const { fname, lname } = makeName();
    usersToInsert.push({
      fname,
      lname,
      email: makeEmail(fname, lname),
      password,
      role: "admin",
      position: "System Administrator",
      department: pick(departments)._id,
      salary: rand(14000, 18000),
      employmentStatus: "active",
    });
  }

  const managerIndices = [];
  const managerTitles = [
    "Engineering Manager",
    "HR Manager",
    "Sales Manager",
    "Marketing Manager",
  ];
  for (let i = 0; i < 4; i++) {
    const { fname, lname } = makeName();
    managerIndices.push(usersToInsert.length);
    usersToInsert.push({
      fname,
      lname,
      email: makeEmail(fname, lname),
      password,
      role: "manager",
      position: managerTitles[i],
      department: departments[i]._id,
      salary: rand(11000, 14000),
      employmentStatus: "active",
    });
  }

  const distribution = [24, 24, 23, 23];
  for (let d = 0; d < 4; d++) {
    for (let i = 0; i < distribution[d]; i++) {
      const { fname, lname } = makeName();
      usersToInsert.push({
        fname,
        lname,
        email: makeEmail(fname, lname),
        password,
        role: "employee",
        position: pick(POSITIONS),
        department: departments[d]._id,
        salary: rand(5000, 11000),
        employmentStatus: chance(0.9) ? "active" : "inactive",
      });
    }
  }

  const users = await User.insertMany(usersToInsert);
  console.log(`Inserted ${users.length} users.`);

  // ---------------- assign managers to departments ----------------
  step("Assigning managers to their departments");
  for (let i = 0; i < 4; i++) {
    departments[i].manager = users[managerIndices[i]]._id;
    await departments[i].save();
  }
  console.log("Managers assigned.");

  const admins = users.filter((u) => u.role === "admin");
  const managers = users.filter((u) => u.role === "manager");
  const employees = users.filter((u) => u.role === "employee");
  const activeEmployees = employees.filter(
    (e) => e.employmentStatus === "active",
  );

  // ---------------- attendance ----------------
  step("Generating attendance records");
  const attendanceDocs = [];
  const DAYS_BACK = 30;
  const today = new Date();

  for (const emp of activeEmployees) {
    for (let offset = 0; offset < DAYS_BACK; offset++) {
      const day = addDays(today, -offset);

      const dow = day.getDay();
      if (dow === 5 || dow === 6) continue;
      if (!chance(0.9)) continue;

      const checkIn = new Date(day);
      checkIn.setHours(rand(8, 9), rand(0, 59), 0, 0);

      let checkOut = null;

      if (offset === 0) {
        const now = new Date();
        if (now.getHours() < 9) continue;
        if (now.getHours() >= 17) {
          checkOut = new Date(day);
          checkOut.setHours(rand(16, 17), rand(0, 59), 0, 0);
        }
      } else if (chance(0.9)) {
        checkOut = new Date(day);
        checkOut.setHours(rand(16, 18), rand(0, 59), 0, 0);
      }

      attendanceDocs.push({
        employee: emp._id,
        workDate: toCairoWorkDate(day),
        checkIn,
        checkOut,
      });
    }
  }

  try {
    await Attendance.insertMany(attendanceDocs);
    console.log(`Inserted ${attendanceDocs.length} attendance records.`);
  } catch (err) {
    console.error("Attendance insert failed:", err.message);
    if (err.insertedDocs) {
      console.error(`  Only ${err.insertedDocs.length} were inserted.`);
    }
  }

  // ---------------- leave requests ----------------
  step("Generating leave requests");
  const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid"];
  const TOTAL_LEAVES = 240;
  const leaveDocs = [];

  for (let i = 0; i < TOTAL_LEAVES; i++) {
    const emp = pick(employees);

    const startOffset = rand(1, 90);
    const duration = rand(1, 5);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startOffset);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const r = Math.random();
    let status;
    if (r < 0.3) status = "Pending";
    else if (r < 0.8) status = "Approved";
    else status = "Rejected";

    const createdAt = new Date(startDate);
    createdAt.setDate(createdAt.getDate() - rand(1, 7));

    leaveDocs.push({
      _id: new mongoose.Types.ObjectId(),
      employeeId: emp._id,
      leaveType: pick(LEAVE_TYPES),
      startDate,
      endDate,
      reason: pick(LEAVE_REASONS),
      status,
      managerComment: status === "Pending" ? "" : pick(MANAGER_COMMENTS),
      createdAt,
      updatedAt: createdAt,
    });
  }

  try {
    await LeaveRequest.collection.insertMany(leaveDocs, { ordered: false });
    console.log(`Inserted ${leaveDocs.length} leave requests.`);
  } catch (err) {
    console.error("Leave request insert failed:", err.message);
  }

  // ---------------- audits ----------------
  step("Generating audit logs");
  const auditDocs = [];

  for (const u of [...admins, ...managers]) {
    for (let i = 0; i < 5; i++) {
      const when = randomDateInLast(30);
      auditDocs.push({
        action: "auth.login",
        category: "auth",
        performedBy: u._id,
        targetType: "User",
        targetId: u._id,
        description: `${u.fname} ${u.lname} signed in`,
        createdAt: when,
        updatedAt: when,
      });
    }
  }

  for (let i = 0; i < 60; i++) {
    const admin = pick(admins);
    const target = pick(employees);
    const when = randomDateInLast(30);
    const action = pick([
      "employee.create",
      "employee.update",
      "employee.deactivate",
      "employee.status",
    ]);
    const descriptions = {
      "employee.create": `Created employee ${target.fname} ${target.lname}`,
      "employee.update": `Updated employee ${target.fname} ${target.lname}`,
      "employee.deactivate": `Deactivated employee ${target.fname} ${target.lname}`,
      "employee.status": `Set ${target.fname} ${target.lname} to ${target.employmentStatus}`,
    };
    auditDocs.push({
      action,
      category: "employee",
      performedBy: admin._id,
      targetType: "User",
      targetId: target._id,
      description: descriptions[action],
      createdAt: when,
      updatedAt: when,
    });
  }

  for (let i = 0; i < 15; i++) {
    const admin = pick(admins);
    const dept = pick(departments);
    const when = randomDateInLast(30);
    const action = pick([
      "department.create",
      "department.update",
      "department.delete",
    ]);
    const verb = action.split(".")[1];
    const label =
      verb === "create"
        ? "Created"
        : verb === "update"
          ? "Updated"
          : "Deleted";
    auditDocs.push({
      action,
      category: "department",
      performedBy: admin._id,
      targetType: "Department",
      targetId: dept._id,
      description: `${label} department "${dept.name}"`,
      createdAt: when,
      updatedAt: when,
    });
  }

  for (let i = 0; i < 80; i++) {
    const leave = leaveDocs[i % leaveDocs.length];
    const isStatus = i >= 40;
    const actor = isStatus ? pick(managers)._id : leave.employeeId;
    const when = randomDateInLast(30);

    auditDocs.push({
      action: isStatus ? "leave.status" : "leave.create",
      category: "leave",
      performedBy: actor,
      targetType: "LeaveRequest",
      targetId: leave._id,
      description: isStatus
        ? `${leave.status} a leave request`
        : `Submitted a ${leave.leaveType} leave request`,
      createdAt: when,
      updatedAt: when,
    });
  }

  for (let i = 0; i < 100; i++) {
    const emp = pick(activeEmployees);
    const when = randomDateInLast(14);
    const isCheckOut = chance(0.5);
    auditDocs.push({
      action: isCheckOut ? "attendance.check-out" : "attendance.check-in",
      category: "attendance",
      performedBy: emp._id,
      targetType: "Attendance",
      targetId: new mongoose.Types.ObjectId(),
      description: isCheckOut
        ? `Checked out for ${toCairoWorkDate(when)}`
        : `Checked in for ${toCairoWorkDate(when)}`,
      createdAt: when,
      updatedAt: when,
    });
  }

  try {
    await Audit.collection.insertMany(auditDocs, { ordered: false });
    console.log(`Inserted ${auditDocs.length} audit logs.`);
  } catch (err) {
    console.error("Audit insert failed:", err.message);
  }

  // ---------------- verification ----------------
  step("Verifying final counts");
  const [userCount, deptCount, attCount, leaveCount, auditCount] =
    await Promise.all([
      User.countDocuments(),
      Department.countDocuments(),
      Attendance.countDocuments(),
      LeaveRequest.countDocuments(),
      Audit.countDocuments(),
    ]);

  console.log(`  Users:          ${userCount} (expected 100)`);
  console.log(`  Departments:    ${deptCount} (expected 4)`);
  console.log(`  Attendance:     ${attCount}`);
  console.log(`  LeaveRequests:  ${leaveCount} (expected 240)`);
  console.log(`  Audits:         ${auditCount}`);

  step("Seeder finished successfully");
  console.log("  Admins (2):");
  admins.forEach((a) => console.log(`    ${a.email}  /  123456`));
  console.log("  Managers (4):");
  managers.forEach((m) =>
    console.log(`    ${m.email}  /  123456  (${m.position})`),
  );
  console.log(`  Employees: ${employees.length} accounts, password: 123456`);
};

// ---------- run only when invoked directly ----------

const invokedDirectly =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (invokedDirectly) {
  seedData()
    .then(async () => {
      await mongoose.connection.close();
      console.log("\nConnection closed. Bye.");
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("\nSeeding failed:");
      console.error(err);
      try {
        await mongoose.connection.close();
      } catch (_) { }
      process.exit(1);
    });
}