import CredentialsProvider from "next-auth/providers/credentials";

import { LoginService } from "@/services/login";
import NextAuth, { AuthOptions } from "next-auth";
import axios from 'axios'


export const authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "jsmith@example.com",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }
          const url = `${process.env.NEXT_PUBLIC_URL_API}/user/login`;
  
          const user = await axios.post(
              url,
              {
                email: credentials.email,
                password: credentials.password,
              },
              {
                headers: {
                  Accept: "application/json",
                },
              }
            )
          if (user) {
            return user.data.data;
          } else {
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: any) {
        if (user) {
          token.id = user.user.id;
          token.fullname = user.user.fullname;
          token.email = user.user.email;
          token.accessToken = user.token;
        }
        return token;
      },
      async session({ session, token }: any) {
        session.accessToken = token.accessToken
        session.id = token.id;
        session.fullname = token.fullname;
        session.email = token.email;
        return session;
      },
    },
    pages: {
      error: '/login',
      signIn: '/login',
      signOut: '/login',
    },
  
    secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  };