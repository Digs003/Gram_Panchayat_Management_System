import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      aadhar,
      password,
      contactNumber: contact_number,
      gender,
      dob,
      email,
      dateofjoining,
      age,
      educationalQualifications: educational_qualfication,
    } = body;
    const client = await pool.connect();
    try {
      const existing_user = await client.query(
        "SELECT * FROM login WHERE username=$1",
        [aadhar]
      );
      if (existing_user.rows.length > 0) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      await client.query("BEGIN");
      const user = await client.query(
        "INSERT INTO citizen(name, gender, dob, contact_number, aadhar_id, occupation, age, educational_qualification) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING citizen_id",
        [
          name,
          gender,
          dob,
          contact_number,
          aadhar,
          "System Administrator",
          age,
          educational_qualfication,
        ]
      );

      await client.query(
        "INSERT INTO login(username,password,user_type,citizen_id) VALUES($1, $2, $3, $4)",
        [aadhar, password, "System Administrator", user.rows[0].citizen_id]
      );

      await client.query(
        "INSERT INTO admin(citizen_id, email, date_of_joining) VALUES($1, $2, $3)",
        [user.rows[0].citizen_id, email, dateofjoining]
      );
      await client.query("COMMIT");

      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("QUERY ERROR", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("DATABASE ERROR", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 501 }
    );
  }
}
