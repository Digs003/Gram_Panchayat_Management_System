import { getUser } from "@/lib/actions/getUser";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { certificate_type, issue_date, validity_period, citizen_id } = body;
  if (!certificate_type || !issue_date || !validity_period) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const { user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (!citizen_id || citizen_id === user.citizen_id) {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO certificate (certificate_type, issue_date, validity_period, citizen_id) VALUES ($1,$2,$3,$4) RETURNING certificate_id`,
      [certificate_type, issue_date, validity_period, user.citizen_id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Failed to add certificate" },
        { status: 500 }
      );
    }
    await client.release();
    return NextResponse.json(
      {
        message: "Certificate added successfully",
        certificate_id: result.rows[0].certificate_id,
      },
      { status: 200 }
    );
  } else if (citizen_id !== user.citizen_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
