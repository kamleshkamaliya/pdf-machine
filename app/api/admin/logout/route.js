import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logged out successfully" });

  // Cookie ko delete karne ke liye maxAge: 0 set karein
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    expires: new Date(0), // Purani date taaki turant expire ho jaye
    path: "/",
  });

  return response;
}