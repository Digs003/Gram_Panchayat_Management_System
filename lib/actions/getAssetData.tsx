"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAssetData() {
  const result = await pool.query("SELECT * FROM asset_management");
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
