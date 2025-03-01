import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    year,
    air_quality_index,
    water_quality_index,
    rainfall,
    forest_cover,
    aadhar_id,
  } = body;
  if (
    !year ||
    !air_quality_index ||
    !water_quality_index ||
    !rainfall ||
    !forest_cover ||
    !aadhar_id
  ) {
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
  const result2 = await client.query(
    `SELECT member_id FROM members WHERE citizen_id = $1`,
    [citizen_id]
  );
  if (result.rowCount === 0) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "No member found" }, { status: 404 });
  }

  const member_id = result2.rows[0].member_id;
  const res = await client.query(
    `INSERT INTO environmental_data (year, air_quality_index, water_quality_index, rainfall, forest_cover) VALUES ($1, $2, $3, $4, $5) RETURNING data_id`,
    [year, air_quality_index, water_quality_index, rainfall, forest_cover]
  );
  const data_id = res.rows[0].data_id;
  await client.query(
    `INSERT INTO updated_by (data_id, member_id) VALUES ($1, $2)`,
    [data_id, member_id]
  );
  await client.query("COMMIT");
  return NextResponse.json(
    { message: "Environmental data added successfully" },
    { status: 200 }
  );
}
