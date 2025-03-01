import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tax_type, amount, aadhar_id, due_date } = body;
  if (!tax_type || !amount || !aadhar_id || !due_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  await client.query("BEGIN");
  const result = await client.query(
    `SELECT citizen_id FROM citizen WHERE aadhar_id = $1`,
    [aadhar_id]
  );
  if (result.rowCount === 0) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "No citizen found" }, { status: 404 });
  }
  const citizen_id = result.rows[0].citizen_id;
  const res = await client.query(
    `INSERT INTO tax (tax_type, amount, due_date, citizen_id) VALUES ($1, $2, $3, $4) RETURNING tax_id`,
    [tax_type, amount, due_date, citizen_id]
  );
  if (res.rowCount === 0) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Tax not added" }, { status: 404 });
  }
  await client.query("COMMIT");
  return NextResponse.json(
    { message: "Tax added successfully" },
    { status: 200 }
  );
}
