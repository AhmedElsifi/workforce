import bcrypt from "bcrypt";
import User from "./db/models/user.model.js";
import Department from "./db/models/department.model.js";

export const seedData = async () => {
  try {
    // Optional: clear old data
    await User.deleteMany({});
    await Department.deleteMany({});

    // Create departments
    const departments = await Department.insertMany([
      {
        name: "Engineering",
        description: "Software Development Team",
      },
      {
        name: "Human Resources",
        description: "Employee Management Team",
      },
    ]);

    const password = await bcrypt.hash("123456", 10);

    // Create users
    const users = await User.insertMany([
      // Admins
      {
        fname: "Ahmed",
        lname: "Admin",
        email: "admin1@test.com",
        password,
        role: "admin",
        position: "System Admin",
        department: departments[0]._id,
        salary: 15000,
        employmentStatus: "active",
      },
      {
        fname: "Mona",
        lname: "Admin",
        email: "admin2@test.com",
        password,
        role: "admin",
        position: "HR Admin",
        department: departments[1]._id,
        salary: 15000,
        employmentStatus: "active",
      },

      // Managers
      {
        fname: "Omar",
        lname: "Manager",
        email: "manager1@test.com",
        password,
        role: "manager",
        position: "Engineering Manager",
        department: departments[0]._id,
        salary: 12000,
        employmentStatus: "active",
      },
      {
        fname: "Sara",
        lname: "Manager",
        email: "manager2@test.com",
        password,
        role: "manager",
        position: "HR Manager",
        department: departments[1]._id,
        salary: 12000,
        employmentStatus: "active",
      },

      // Employees
      {
        fname: "Ali",
        lname: "Employee",
        email: "employee1@test.com",
        password,
        role: "employee",
        position: "Frontend Developer",
        department: departments[0]._id,
        salary: 8000,
        employmentStatus: "active",
      },
      {
        fname: "Nour",
        lname: "Employee",
        email: "employee2@test.com",
        password,
        role: "employee",
        position: "HR Specialist",
        department: departments[1]._id,
        salary: 7000,
        employmentStatus: "active",
      },
    ]);

    // Assign managers to departments
    departments[0].manager = users[2]._id; // Omar
    departments[1].manager = users[3]._id; // Sara

    await departments[0].save();
    await departments[1].save();

    console.log("Seed completed successfully");
  } catch (error) {
    console.error(error);
  }
};
