"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getMonitor() {
  const result = await pool.query(
    `SELECT * 
        FROM citizen 
        JOIN monitors ON citizen.citizen_id = monitors.citizen_id 
        WHERE citizen.occupation = 'Government Monitor';
    `
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
