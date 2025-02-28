import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { aadhar_id } = body;
    if (!aadhar_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const client = await pool.connect();
    await client.query(
      `DELETE FROM citizen 
        WHERE aadhar_id = $1`,
      [aadhar_id]
    );
    return NextResponse.json(
      { message: "Citizen deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
