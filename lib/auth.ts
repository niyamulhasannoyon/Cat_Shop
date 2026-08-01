import { cookies } from "next/headers";
import crypto from "crypto";
import { Staff } from "@/types";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "paws-co-super-secret-admin-key-2026-bd";
const COOKIE_NAME = "paws_admin_session";

function hashPasswordSync(password: string, salt = "paws_salt_2026"): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export const INITIAL_SERVER_STAFF: (Omit<Staff, "password"> & { passwordHash: string })[] = [
  {
    id: "staff-admin",
    name: "Administrator",
    email: "admin@paws.co",
    role: "Super Admin",
    passwordHash: hashPasswordSync("admin123"),
    createdAt: new Date("2026-07-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "staff-manager",
    name: "Rahat Manager",
    email: "manager@paws.co",
    role: "Manager",
    passwordHash: hashPasswordSync("manager123"),
    createdAt: new Date("2026-07-10T00:00:00.000Z").toISOString(),
  },
  {
    id: "staff-support",
    name: "Sumaiya Support",
    email: "support@paws.co",
    role: "Support",
    passwordHash: hashPasswordSync("support123"),
    createdAt: new Date("2026-07-20T00:00:00.000Z").toISOString(),
  },
];

export interface SessionPayload {
  staffId: string;
  name: string;
  email: string;
  role: Staff["role"];
  exp: number;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const hash = hashPasswordSync(password);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(passwordHash));
}

export function createSessionToken(staff: { id: string; name: string; email: string; role: Staff["role"] }): string {
  const payload: SessionPayload = {
    staffId: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const json = JSON.stringify(payload);
  const base64Payload = Buffer.from(json).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [base64Payload, signature] = token.split(".");
    if (!base64Payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(base64Payload)
      .digest("base64url");

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const json = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(json) as SessionPayload;

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getStaffSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
