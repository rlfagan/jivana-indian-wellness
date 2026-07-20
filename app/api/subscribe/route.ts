import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    const db = getDb();
    await db.execute("CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
    await db.execute({ sql: "INSERT OR IGNORE INTO subscribers (email) VALUES (?)", args: [email.toLowerCase()] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscription error", error);
    return NextResponse.json({ error: "The list is not connected yet. Please try again later." }, { status: 503 });
  }
}
