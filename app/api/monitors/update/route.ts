import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const {
      name,
      contact_number,
      educational_qualification,
      aadhar_id,
      salary,
    } = body;
    if (
      !aadhar_id ||
      !name ||
      !contact_number ||
      !educational_qualification ||
      !salary
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const client = await pool.connect();
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE citizen 
            SET name = $1, contact_number = $2, educational_qualification = $3 
            WHERE aadhar_id = $4 
            RETURNING citizen_id`,
      [name, contact_number, educational_qualification, aadhar_id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }
    const citizen_id = result.rows[0].citizen_id;
    await client.query(
      `UPDATE monitors 
            SET  salary = $1 
            WHERE citizen_id = $2`,
      [salary, citizen_id]
    );
    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Citizen updated successfully" },
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
