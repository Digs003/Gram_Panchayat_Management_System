import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { land_area, crop_type, valuation, _yield, owner_name } = body;
  if (!land_area || !crop_type || !valuation || !_yield || !owner_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  await client.query("BEGIN");
  const result = await client.query(
    `SELECT citizen_id FROM citizen WHERE name = $1`,
    [owner_name]
  );
  if (result.rowCount === 0) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "No citizen found" }, { status: 404 });
  }
  const citizen_id = result.rows[0].citizen_id;
  const result2 = await client.query(
    `INSERT INTO agricultural_data (land_area,crop_type,valuation,yield) VALUES ($1,$2,$3,$4) RETURNING record_id`,
    [land_area, crop_type, valuation, _yield]
  );
  const record_id = result2.rows[0].record_id;
  await client.query(
    `INSERT INTO citizen_agri (record_id,citizen_id) VALUES ($1,$2)`,
    [record_id, citizen_id]
  );
  await client.query("COMMIT");
  await client.release();
  return NextResponse.json(
    { message: "Data added successfully" },
    { status: 200 }
  );
}
