import NextAuth from "next-auth/next";
import type { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";

async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    let roles: string[] = [];
    try {
      const decodedAccess = JSON.parse(
         Buffer.from(refreshedTokens.access_token.split(".")[1], "base64").toString()
      );
      roles = decodedAccess.realm_access?.roles || [];
    } catch (err) {
      console.error("Failed to decode refreshed access_token", err);
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      roles,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions = {
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: { params: { scope: "openid profile email offline_access" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        let roles: string[] = [];
        try {
          const decodedAccess = JSON.parse(
             Buffer.from(account.access_token!.split(".")[1], "base64").toString()
          );
          roles = decodedAccess.realm_access?.roles || [];
        } catch (err) {
          console.error("Failed to decode access_token", err);
        }

        return {
          ...token,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + (account.expires_in || 0)),
          refresh_token: account.refresh_token,
          roles,
        };
      } else if (Date.now() < token.expires_at! * 1000) {
        return token;
      } else {
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");
        return refreshAccessToken(token);
      }
    },
    async session({ session, token }) {
      session.accessToken = token.access_token;
      session.roles = token.roles || [];
      session.error = token.error;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/home`;
    },
  },
};

export default NextAuth(authOptions);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    roles?: string[];
    error?: "RefreshTokenError";
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    roles?: string[];
    error?: "RefreshTokenError";
  }
}
