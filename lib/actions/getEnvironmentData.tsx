"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getEnvironmentData() {
  const result = await pool.query("SELECT * FROM environmental_data");
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
