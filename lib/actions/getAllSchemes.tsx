"use server";
import { Pool } from "pg";
import { getUser } from "./getUser";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAllSchemes() {
  const { user } = await getUser();
  const result = await pool.query(
    `
    SELECT ws.*,  se.status as application_status
    FROM welfare_scheme ws
    LEFT JOIN scheme_enrollments se 
    ON ws.scheme_id = se.scheme_id 
    AND se.citizen_id = $1
    `,
    [user.citizen_id]
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
