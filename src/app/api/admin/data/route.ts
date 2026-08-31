import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/guard";
import { getDbShape } from "@/lib/db/repo";

/**
 * Authenticated GET — returns the full persisted site data (minus the admin
 * password hash). Used by the admin client editors to refetch fresh state
 * after mutations.
 */
export async function GET(request: Request) {
  const denied = requireAdminApi(request);
  if (denied) return denied;

  const db = await getDbShape();
  const { admin, ...rest } = db;
  return NextResponse.json({
    ...rest,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  });
}
