import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
} 