import { getUser } from "@/lib/actions/getUser";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { scheme_id, reason, status, date_of_enrollment, annual_income } = body;
  if (
    !scheme_id ||
    !reason ||
    !status ||
    !date_of_enrollment ||
    !annual_income
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const { user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const client = await pool.connect();
  const result = await client.query(
    `INSERT INTO scheme_enrollments (citizen_id, scheme_id, reason, status, date_of_enrollment,annual_income) VALUES ($1,$2,$3,$4,$5,$6) RETURNING enrollment_id`,
    [
      user.citizen_id,
      scheme_id,
      reason,
      status,
      date_of_enrollment,
      annual_income,
    ]
  );
  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Failed to apply scheme" },
      { status: 500 }
    );
  }
  await client.release();
  return NextResponse.json(
    {
      message: "Scheme applied successfully",
      enrollment_id: result.rows[0].enrollment_id,
    },
    { status: 200 }
  );
}
