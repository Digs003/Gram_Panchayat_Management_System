"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const result = await pool.query(
    "SELECT * FROM citizen WHERE citizen_id = $1",
    [userId]
  );
  if (result.rows.length > 0) {
    return {
      user: JSON.parse(JSON.stringify(result.rows[0])),
    };
  }
  return {
    user: null,
  };
}
