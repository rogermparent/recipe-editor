import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isEditorPath =
        nextUrl.pathname.endsWith("/edit") || nextUrl.pathname === "/new-post";
      const isSettingsPath = nextUrl.pathname.startsWith("/settings");
      const isPrivilegedPath = isEditorPath || isSettingsPath;
      if (isPrivilegedPath) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to signIn page
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
