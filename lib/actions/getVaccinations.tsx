"use server";
import { Pool } from "pg";
import { getUser } from "./getUser";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getVaccinations() {
  const { user } = await getUser();
  const result = await pool.query(
    `
    SELECT v.* ,c.aadhar_id as citizen_aadhar
    FROM vaccination v
    JOIN citizen c ON v.citizen_id = c.citizen_id
    WHERE c.citizen_id = $1
  `,
    [user.citizen_id]
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
