"use server";
import { Pool } from "pg";
import { getUser } from "./getUser";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getCertificates() {
  const { user } = await getUser();
  const result = await pool.query(
    `
        SELECT *
        FROM certificate
        WHERE citizen_id = $1
    `,
    [user.citizen_id]
  );
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
