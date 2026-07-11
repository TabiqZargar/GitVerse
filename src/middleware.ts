import { auth } from "@/lib/auth";

export default auth((req) => {
  const publicPaths = ["/", "/login", "/u/", "/share/"];
  const isPublic = publicPaths.some((p) => req.nextUrl.pathname === p || req.nextUrl.pathname.startsWith(p));
  if (!isPublic && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
