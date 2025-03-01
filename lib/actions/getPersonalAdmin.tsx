"use server";
import { Pool } from "pg";
import { getUser } from "./getUser";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getPersonalAdmin() {
  const { user } = await getUser();
  if (!user) {
    return {
      user: {},
    };
  }
  const result = await pool.query(
    `SELECT * 
    FROM citizen
    JOIN admin ON citizen.citizen_id = admin.citizen_id
    WHERE citizen.citizen_id = $1`,
    [user.citizen_id]
  );
  return {
    user: result?.rows?.[0] ? JSON.parse(JSON.stringify(result.rows[0])) : {},
  };
}
