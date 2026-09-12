import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "career_admin";

function adminSecret() {
  return process.env.AUTH_SECRET ?? "career-skill-tree-local-development-secret";
}

export function createAdminToken() {
  return createHmac("sha256", adminSecret()).update("career-admin").digest("hex");
}

export function isValidAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "0000";
  const supplied = Buffer.from(password);
  const target = Buffer.from(expected);
  return supplied.length === target.length && timingSafeEqual(supplied, target);
}

export async function isAdminAuthenticated() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const supplied = Buffer.from(value);
  const target = Buffer.from(createAdminToken());
  return supplied.length === target.length && timingSafeEqual(supplied, target);
}
