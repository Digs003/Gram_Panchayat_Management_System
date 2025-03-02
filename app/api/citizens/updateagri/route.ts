import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { land_area, crop_type, valuation, _yield, record_id } = body;
  if (!land_area || !crop_type || !valuation || !_yield || !record_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  const result = await client.query(
    `UPDATE agricultural_data 
    SET land_area = $1, crop_type = $2, valuation = $3, yield = $4 
    WHERE record_id = $5`,
    [land_area, crop_type, valuation, _yield, record_id] // Single array of parameters
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  client.release();
  return NextResponse.json(
    { message: "Data added successfully" },
    { status: 200 }
  );
}
