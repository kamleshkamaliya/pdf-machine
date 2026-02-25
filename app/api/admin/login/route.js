import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    const email = (body?.email || "").toString().trim();
    const password = (body?.password || "").toString();

    const envEmail = (process.env.ADMIN_EMAIL || "").toString().trim();
    const envPass = (process.env.ADMIN_PASSWORD || "").toString();
    const jwtSecret = (process.env.JWT_SECRET || "").toString();

    if (!email || !password) return new NextResponse("Missing fields", { status: 400 });
    if (!envEmail || !envPass || !jwtSecret) return new NextResponse("Server env missing", { status: 500 });

    if (email !== envEmail || password !== envPass) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // 1. Token ki expiry 30 minutes set karein
    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "30m" }); // 👈 "7d" se badal kar "30m" kiya

    const res = NextResponse.json({ ok: true });
    
    // 2. Cookie ki life bhi 30 minutes (1800 seconds) karein
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60, // 👈 1800 seconds (yaani 30 minutes)
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}