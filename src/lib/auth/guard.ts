import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getServerSession, getSessionFromRequest } from "./session";

/** Server-component guard — boot unauthenticated visitors to the admin login. */
export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Route-handler guard — 401 when the request isn't authenticated. */
export function requireAdminApi(request: NextRequest | Request): Response | null {
  const session = getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
