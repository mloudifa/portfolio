import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "mloudifa_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;
  role: "admin";
  iat: number;
  exp: number;
}

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "mloudifa-dev-secret-change-me-in-production";
}

function b64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function fromB64url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(input: string): string {
  return createHmac("sha256", getSecret()).update(input).digest("base64url");
}

/** Create a signed, expiring session token (stateless, HMAC-SHA256). */
export async function createSessionToken(payload: {
  sub: string;
  role: "admin";
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const body = b64url(JSON.stringify(session));
  return `${body}.${sign(body)}`;
}

/** Verify a session token. Returns the payload or null when invalid/expired. */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const actual = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actual.length !== expectedBuf.length || !actual.equals(expectedBuf)) {
    return null;
  }
  try {
    const payload = JSON.parse(fromB64url(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read + verify the session from an incoming request (route handlers). */
export function getSessionFromRequest(request: NextRequest | Request): SessionPayload | null {
  const cookieHeader =
    request instanceof NextRequest
      ? request.cookies.get(SESSION_COOKIE)?.value
      : parseCookieHeader(request.headers.get("cookie") ?? "")[SESSION_COOKIE];
  return verifySessionToken(cookieHeader);
}

/** Read + verify the session from cookies (server components / actions). */
export async function getServerSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

function parseCookieHeader(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
  }
  return result;
}
