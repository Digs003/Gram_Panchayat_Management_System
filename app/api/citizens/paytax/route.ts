import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tax_id, payment_date } = body;
  if (!tax_id || !payment_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const result = await pool.query(
    `UPDATE tax 
        SET payment_date = $1
        WHERE tax_id = $2`,
    [payment_date, tax_id] // Single array of parameters
  );
  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  return NextResponse.json(
    { message: "Data added successfully" },
    { status: 200 }
  );
}
