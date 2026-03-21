import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isSeller = token?.role === "seller";
    const isAdmin = token?.role === "admin";
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard/seller") && !isSeller && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/cart", "/orders", "/checkout"],
};
