import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { scheme_name, starting_date, budget, description, status, scheme_id } =
    body;
  if (
    !scheme_name ||
    !starting_date ||
    !budget ||
    !description ||
    !status ||
    !scheme_id
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  const result = await client.query(
    `UPDATE welfare_scheme SET scheme_name = $1, starting_date = $2, budget = $3, description = $4, status = $5 WHERE scheme_id = $6`,
    [scheme_name, starting_date, budget, description, status, scheme_id]
  );
  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Failed to update scheme" },
      { status: 500 }
    );
  }
  await client.release();
  return NextResponse.json(
    { message: "Scheme updated successfully" },
    { status: 200 }
  );
}
