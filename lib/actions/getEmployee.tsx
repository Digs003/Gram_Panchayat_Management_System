"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getEmployee() {
  const result = await pool.query(
    `SELECT * 
        FROM citizen 
        JOIN members ON citizen.citizen_id = members.citizen_id 
        WHERE citizen.occupation = 'Panchayat Employee';
    `
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
