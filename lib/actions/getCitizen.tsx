"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getCitizen() {
  const result = await pool.query("SELECT * FROM citizen");
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
