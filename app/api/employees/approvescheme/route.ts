import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { enrollment_id, status } = body;
  if (!enrollment_id || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  const result = await client.query(
    `UPDATE scheme_enrollments SET status = $1 WHERE enrollment_id = $2`,
    [status, enrollment_id]
  );
  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Failed to update scheme enrollment" },
      { status: 500 }
    );
  }
  await client.release();
  return NextResponse.json(
    { message: "Scheme enrollment updated successfully" },
    { status: 200 }
  );
}
