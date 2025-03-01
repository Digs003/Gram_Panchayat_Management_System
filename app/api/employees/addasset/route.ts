import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    asset_name,
    quantity,
    locality,
    installation_year,
    amount_spent,
    aadhar_id,
  } = body;
  if (
    !asset_name ||
    !quantity ||
    !locality ||
    !installation_year ||
    !amount_spent ||
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
    `INSERT INTO asset_management(asset_name, quantity, locality, installation_year, amount_spent) VALUES ($1, $2, $3, $4, $5) RETURNING asset_id`,
    [asset_name, quantity, locality, installation_year, amount_spent]
  );
  const asset_id = res.rows[0].asset_id;
  await client.query(
    `INSERT INTO managed_by (asset_id, member_id) VALUES ($1, $2)`,
    [asset_id, member_id]
  );
  await client.query("COMMIT");
  return NextResponse.json(
    { message: "Census data added successfully" },
    { status: 200 }
  );
}
