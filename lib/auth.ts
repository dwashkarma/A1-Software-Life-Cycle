import { type NextRequest } from "next/server";

export const SESSION_COOKIE = "travel_mate_session";

export type SessionUser = {
  id: string;
  role: "traveller" | "admin";
};

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) return null;

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf-8");
    const parsed = JSON.parse(decoded) as Partial<SessionUser>;

    if (!parsed.id || !parsed.role) {
      return null;
    }

    if (parsed.role !== "traveller" && parsed.role !== "admin") {
      return null;
    }

    return {
      id: parsed.id,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  return decodeSession(sessionCookie);
}
