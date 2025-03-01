"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAllTax() {
  const result = await pool.query(`
        SELECT tax.*, citizen.name as name 
        FROM tax
        JOIN citizen ON tax.citizen_id = citizen.citizen_id
    `);
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
