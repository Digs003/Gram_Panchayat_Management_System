import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { scheme_name, starting_date, budget, description, status } = body;
  if (!scheme_name || !starting_date || !budget || !description || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const client = await pool.connect();
  const result = await client.query(
    `INSERT INTO welfare_scheme (scheme_name,starting_date,budget,description,status) VALUES ($1,$2,$3,$4,$5)`,
    [scheme_name, starting_date, budget, description, status]
  );
  if (result.rowCount === 0) {
    return NextResponse.json(
      { error: "Failed to add scheme" },
      { status: 500 }
    );
  }
  await client.release();
  return NextResponse.json(
    { message: "Scheme added successfully" },
    { status: 200 }
  );
}
