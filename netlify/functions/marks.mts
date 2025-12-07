import type { Context } from "@netlify/functions";
import { Pool } from "pg";
import type { Mark, CreateMarkRequest } from "../../lib/types/api";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
});

interface DbMark {
  id: number;
  item_id: string;
  user_id: number;
  note: string | null;
  rating: number | null;
  liked: boolean;
  created_at: Date;
}

interface DbMarkWithUser extends DbMark {
  username: string;
}

function dbMarkToMark(dbMark: DbMark): Mark {
  return {
    id: dbMark.id,
    item_id: dbMark.item_id,
    user_id: dbMark.user_id,
    note: dbMark.note,
    rating: dbMark.rating,
    liked: dbMark.liked,
    created_at: dbMark.created_at.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: Request, _context: Context) {
  if (req.method === "GET") {
    return handleGet(req);
  }

  if (req.method === "POST") {
    return handlePost(req);
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleGet(req: Request) {
  const url = new URL(req.url);
  const itemId = url.searchParams.get("item_id");
  const userId = url.searchParams.get("user_id");
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  try {
    if (userId) {
      // Get marks for a specific user (with article info and stats)
      const result = await pool.query<
        DbMarkWithUser & { title: string; creators_string: string }
      >(
        `SELECT m.id, m.item_id, m.user_id, m.note, m.rating, m.liked, m.created_at,
                u.username, a.title, a.creators_string
         FROM marks m
         JOIN users u ON m.user_id = u.id
         JOIN jstor_articles a ON m.item_id = a.item_id
         WHERE m.user_id = $1
         ORDER BY m.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      const marks = result.rows.map((row) => ({
        ...dbMarkToMark(row),
        username: row.username,
        article_title: row.title,
        article_creators: row.creators_string,
      }));

      // Get stats for the user
      const statsResult = await pool.query<{
        total_read: string;
        total_liked: string;
        avg_rating: string | null;
      }>(
        `SELECT
           COUNT(*) as total_read,
           COUNT(*) FILTER (WHERE liked = true) as total_liked,
           AVG(rating) FILTER (WHERE rating IS NOT NULL) as avg_rating
         FROM marks
         WHERE user_id = $1`,
        [userId]
      );

      const stats = statsResult.rows[0];

      return new Response(
        JSON.stringify({
          data: marks,
          stats: {
            totalRead: parseInt(stats.total_read, 10),
            totalLiked: parseInt(stats.total_liked, 10),
            avgRating: stats.avg_rating ? parseFloat(stats.avg_rating) : null,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (itemId) {
      // Get marks for a specific article
      const result = await pool.query<DbMarkWithUser>(
        `SELECT m.id, m.item_id, m.user_id, m.note, m.rating, m.liked, m.created_at, u.username
         FROM marks m
         JOIN users u ON m.user_id = u.id
         WHERE m.item_id = $1
         ORDER BY m.created_at DESC`,
        [itemId]
      );

      const marks = result.rows.map((row) => ({
        ...dbMarkToMark(row),
        username: row.username,
      }));

      return new Response(JSON.stringify({ data: marks }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Get recent marks across all articles (with article info)
      const result = await pool.query<
        DbMarkWithUser & {
          title: string;
          creators_string: string;
          published_date: string;
          content_type: string;
        }
      >(
        `SELECT m.id, m.item_id, m.user_id, m.note, m.rating, m.liked, m.created_at,
                u.username, a.title, a.creators_string, a.published_date, a.content_type
         FROM marks m
         JOIN users u ON m.user_id = u.id
         JOIN jstor_articles a ON m.item_id = a.item_id
         ORDER BY m.created_at DESC
         LIMIT $1`,
        [limit]
      );

      const marks = result.rows.map((row) => ({
        ...dbMarkToMark(row),
        username: row.username,
        article_title: row.title,
        article_creators: row.creators_string,
        article_published_date: row.published_date,
        article_content_type: row.content_type,
      }));

      return new Response(JSON.stringify({ data: marks }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handlePost(req: Request) {
  let body: CreateMarkRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { item_id, user_id, note, rating, liked } = body;

  if (!item_id || !user_id) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: item_id and user_id" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const result = await pool.query<DbMark>(
      `INSERT INTO marks (item_id, user_id, note, rating, liked)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, item_id, user_id, note, rating, liked, created_at`,
      [item_id, user_id, note || null, rating || null, liked ?? false]
    );

    const mark = dbMarkToMark(result.rows[0]);

    return new Response(JSON.stringify({ data: mark }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
