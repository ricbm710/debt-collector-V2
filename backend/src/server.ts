import "./config/env.js";
import express from "express";
import { getPool } from "./db/database.js";
import { env } from "./config/env.js";
//routes
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

const pool = getPool();

const app = express();

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("✅ Database connected");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("❌ Database connection failed");
    console.error(err);
  }
}

testDatabaseConnection();
