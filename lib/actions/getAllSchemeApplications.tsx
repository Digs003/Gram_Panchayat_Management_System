"use server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function getAllSchemeApplications() {
  const result = await pool.query(
    `SELECT se.enrollment_id,se.status,se.scheme_id,se.reason,se.annual_income,se.date_of_enrollment,
          c.name,c.aadhar_id,c.dob,ws.scheme_name
        FROM scheme_enrollments se,citizen c,welfare_scheme ws
        WHERE se.citizen_id = c.citizen_id AND se.scheme_id = ws.scheme_id`
  );
  console.log(result.rows);
  return {
    user: JSON.parse(JSON.stringify(result.rows)) || [],
  };
}
