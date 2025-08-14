import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
   const sessionToken = req.cookies.get("next-auth.session-token")?.value;

   if (!sessionToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/animals/:path*",
      "/chat/:path*",
   ],
};
