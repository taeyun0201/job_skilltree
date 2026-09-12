export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/skill-map/:path*", "/onboarding/:path*"],
};
