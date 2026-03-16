import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isSeller = token?.role === "seller";
    const isSellerRoute = req.nextUrl.pathname.startsWith("/dashboard/seller");

    if (isSellerRoute && !isSeller) {
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
