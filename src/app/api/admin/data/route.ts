import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/guard";
import { getDbShape } from "@/lib/db/repo";

/** Authenticated GET — fresh site data (minus the password hash) for the admin editors. */
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
