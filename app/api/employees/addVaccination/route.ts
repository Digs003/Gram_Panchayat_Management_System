import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { vaccine_type, date_administered, dose_number, citizen_aadhar } = body;
  if (!vaccine_type || !date_administered || !dose_number || !citizen_aadhar) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  const res = await client.query(
    "SELECT citizen_id FROM citizen WHERE aadhar_id=$1",
    [citizen_aadhar]
  );
  if (res.rowCount === 0) {
    return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
  }
  const citizen_id = res.rows[0].citizen_id;
  const result = await client.query(
    `INSERT INTO vaccination (vaccine_type, date_administered, dose_number, citizen_id) VALUES ($1,$2,$3,$4) RETURNING vaccine_id`,
    [vaccine_type, date_administered, dose_number, citizen_id]
  );
  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Failed to add vaccination" },
      { status: 500 }
    );
  }
  await client.release();
  return NextResponse.json(
    {
      message: "Vaccination added successfully",
      vaccine_id: result.rows[0].vaccine_id,
    },
    { status: 200 }
  );
}
