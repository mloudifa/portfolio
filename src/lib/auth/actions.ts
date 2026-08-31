"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/store";
import { verifyPassword } from "./password";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./session";

export interface LoginResult {
  error?: string;
}

/** Authenticate against the stored admin credentials and open an admin session. */
export async function loginAction(
  _prev: LoginResult | undefined,
  formData: FormData,
): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const db = await getDb();
  const admin = db.admin;
  const emailOk = admin.email.toLowerCase() === email;
  const passwordOk = emailOk ? await verifyPassword(password, admin.passwordHash) : false;

  if (!emailOk || !passwordOk) {
    return { error: "Invalid email or password." };
  }

  const token = await createSessionToken({ sub: admin.email, role: "admin" });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

/** End the admin session and return to the login page. */
export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
