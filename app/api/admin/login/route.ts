import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INITIAL_SERVER_STAFF, verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const staffMember = INITIAL_SERVER_STAFF.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );

    if (!staffMember || !verifyPassword(password, staffMember.passwordHash)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      staff: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        createdAt: staffMember.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication failed", error: String(error) },
      { status: 500 }
    );
  }
}
