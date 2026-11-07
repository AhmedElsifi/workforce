import mongoose from "mongoose";

const uri = process.env.MONGO_DB_CONNECTION_STRING;

if (!uri) {
  throw new Error(
    "FATAL: MONGO_DB_CONNECTION_STRING environment variable is missing.",
  );
}

// Log a sanitized version of the URI so we can debug without leaking the password.
const sanitized = uri.replace(/\/\/([^@]+)@/, "//<credentials>@");
console.log("MongoDB connection target:", sanitized);

// Do NOT chain .catch() on this promise — its rejection must propagate
// to the middleware in app.js so the request fails fast instead of buffering.
const dbConnection = mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
});

dbConnection
  .then((m) => console.log("MongoDB connected to:", m.connection.host))
  .catch((err) =>
    console.error("MongoDB initial connection failed:", err.message),
  );

export default dbConnection;