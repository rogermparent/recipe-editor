import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  callbacks: {
    authorized({ auth }) {
      const allowGuest = true;
      const isLoggedIn = !!auth?.user;
      if (allowGuest) {
        return true;
      } else {
        return isLoggedIn;
      }
    },
  },
  providers: [],
} satisfies NextAuthConfig;
