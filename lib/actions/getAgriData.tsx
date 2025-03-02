"use server";
import { Pool } from "pg";
import { getUser } from "./getUser";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAgriData() {
  const { user } = await getUser();
  const result = await pool.query(
    `
        SELECT a.*
        FROM agricultural_data a
        JOIN citizen_agri ca ON a.record_id = ca.record_id
        WHERE ca.citizen_id = $1
    `,
    [user.citizen_id]
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
