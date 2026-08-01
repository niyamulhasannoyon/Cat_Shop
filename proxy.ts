import { NextResponse, NextRequest } from "next/server";

const COOKIE_NAME = "paws_admin_session";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "paws-co-super-secret-admin-key-2026-bd";

async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [base64Payload, signature] = parts;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const payloadUint8 = encoder.encode(base64Payload);
    const sigString = atob(signature.replace(/-/g, "+").replace(/_/g, "/"));
    const sigUint8 = new Uint8Array(sigString.length);
    for (let i = 0; i < sigString.length; i++) {
      sigUint8[i] = sigString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, sigUint8, payloadUint8);
    if (!isValid) return false;

    const jsonStr = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(jsonStr);
    if (payload.exp && Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = token ? await verifyTokenEdge(token) : false;

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
