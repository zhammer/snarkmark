import type { Context } from "@netlify/functions";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
});

interface DbUser {
  id: number;
  username: string;
  email: string | null;
  created_at: Date;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: Request, _context: Context) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response(
      JSON.stringify({ error: "Missing username parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Try to find existing user
    let result = await pool.query<DbUser>(
      `SELECT id, username, email, created_at FROM users WHERE username = $1`,
      [username]
    );

    // If user doesn't exist, create them
    if (result.rows.length === 0) {
      result = await pool.query<DbUser>(
        `INSERT INTO users (username) VALUES ($1) RETURNING id, username, email, created_at`,
        [username]
      );
    }

    const user = result.rows[0];

    return new Response(
      JSON.stringify({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at.toISOString(),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
