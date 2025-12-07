import type { Context } from "@netlify/functions";
import { Pool } from "pg";
import type { JstorArticle, ArticlesResponse } from "../../lib/types/api";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: Request, _context: Context) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search")?.trim() || "";

  try {
    let countResult;
    let result;

    if (search) {
      const searchPattern = `%${search}%`;
      countResult = await pool.query(
        `SELECT COUNT(*) FROM jstor_articles
         WHERE title ILIKE $1 OR creators_string ILIKE $1`,
        [searchPattern]
      );
      result = await pool.query<JstorArticle>(
        `SELECT a.item_id, a.title, a.published_date, a.creators_string, a.url, a.content_type,
                AVG(m.rating) as avg_rating
         FROM jstor_articles a
         LEFT JOIN marks m ON a.item_id = m.item_id
         WHERE a.title ILIKE $1 OR a.creators_string ILIKE $1
         GROUP BY a.item_id, a.title, a.published_date, a.creators_string, a.url, a.content_type
         ORDER BY a.published_date DESC
         LIMIT $2 OFFSET $3`,
        [searchPattern, limit, offset]
      );
    } else {
      countResult = await pool.query("SELECT COUNT(*) FROM jstor_articles");
      result = await pool.query<JstorArticle>(
        `SELECT a.item_id, a.title, a.published_date, a.creators_string, a.url, a.content_type,
                AVG(m.rating) as avg_rating
         FROM jstor_articles a
         LEFT JOIN marks m ON a.item_id = m.item_id
         GROUP BY a.item_id, a.title, a.published_date, a.creators_string, a.url, a.content_type
         ORDER BY a.published_date DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    }

    const total = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(total / limit);

    const response: ArticlesResponse = {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
