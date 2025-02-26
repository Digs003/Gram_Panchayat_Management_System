/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
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

        let client: any;
        try {
          console.log("Connecting to database");
          client = await pool.connect();
          console.log("Client connected");
          const existing_user = await client.query(
            "SELECT * FROM login WHERE username = $1",
            [credentials.email]
          );
          if (existing_user.rows.length === 0) {
            console.log("User not found");
            return null;
          }
          const user = existing_user.rows[0];
          console.log("User", user);
          // const match = await bcrypt.compare(
          //   credentials.password,
          //   user.password
          // );
          // if (!match) {
          //   console.log("Password does not match");
          //   return null;
          // }
          return { id: user.citizen_id, email: user.username };
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
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
};
