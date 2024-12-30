import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiClient } from "./axios";

import { siteConfig } from "@/config/site";

const AUTHENTICATION_METHODS = {
  EMAIL: {
    key: "emailLogin",
    credentials: {
      email: { type: "text" },
      password: { type: "password" },
      organization_id: { type: "text" },
    },
  },
  TOKEN: {
    key: "tokenLogin",
    credentials: {
      iat: { type: "text" },
      exp: { type: "text" },
      type: { type: "text" },
      user_id: { type: "text" },
      organization_id: { type: "text" },
      access_token: { type: "text" },
      refresh_token: { type: "text" },
    },
  },
};

const MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: AUTHENTICATION_METHODS.EMAIL.key,
      credentials: AUTHENTICATION_METHODS.EMAIL.credentials,
      async authorize(credentials) {
        const response = await apiClient.post(siteConfig.apiRoutes.login, {
          email: credentials?.email,
          password: credentials?.password,
          organization_id: credentials?.organization_id,
        });

        if (response.data?.message) {
          throw new Error(response.data.message);
        }

        const session = response.data;

        return {
          id: session.user_id,
          name: "",
          email: "",
          organization_id: session.organization_id,
          access_token: session.access_token,
        };
      },
    }),
    CredentialsProvider({
      id: AUTHENTICATION_METHODS.TOKEN.key,
      credentials: AUTHENTICATION_METHODS.TOKEN.credentials,
      async authorize(credentials) {
        if (credentials) {
          return {
            ...credentials,
            id: credentials.user_id,
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  jwt: {
    maxAge: MAX_AGE,
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session.info) {
        return {
          ...token,
          ...session.info,
        };
      }

      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
    async redirect({ baseUrl }) {
      return baseUrl + siteConfig.routes.home;
    },
  },
  secret: process.env.NEXTAUTH_URL,
};
