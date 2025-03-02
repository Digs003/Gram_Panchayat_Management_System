"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAllVaccinations() {
  const result = await pool.query(`
    SELECT v.* ,c.aadhar_id as citizen_aadhar
    FROM vaccination v
    JOIN citizen c ON v.citizen_id = c.citizen_id`);
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
