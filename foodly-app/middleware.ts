import { withAuth } from "next-auth/middleware";

import { siteConfig } from "./config/site";

export default withAuth(async function middleware(req) { }, {
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
  pages: {
    signIn: siteConfig.routes.login,
  },
});
export const config = {
  matcher: ["/", "/home/:path*", "/history-order/:path*", "/my-group/:path*"],
};
