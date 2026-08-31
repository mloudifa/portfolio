import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getServerSession, getSessionFromRequest } from "./session";

/**
 * Guard for server components / layouts.
 * Redirects unauthenticated visitors to the admin login page.
 */
export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Guard for route handlers. Returns a 401 Response when the request
 * is not authenticated, otherwise null.
 */
export function requireAdminApi(request: NextRequest | Request): Response | null {
  const session = getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
