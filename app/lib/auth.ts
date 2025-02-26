import { Pool } from "pg";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { pages } from "next/dist/build/templates/app-page";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        email: {
          label: "Email",
          type: "email",
          placeholder: "abcd@emaple.com",
        },
      },
      async authorize(credentials: any) {
        if (!credentials.password || !credentials.email) {
          console.log("Missing required fields");
          return null;
        }
        const client = await pool.connect();
        try {
          const existing_user = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );
          if (existing_user.rows.length === 0) {
            console.log("User not found");
            return null;
          }
          const user = existing_user.rows[0];
          const match = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!match) {
            console.log("Password does not match");
            return null;
          }
          return { id: user.citizen_id, name: user.name, email: user.email };
        } catch (e) {
          console.error("DATABASE ERROR", e);
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "api/auth/signin",
  },
};
