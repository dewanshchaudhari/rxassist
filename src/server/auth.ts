import { env } from "@/env";
import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import axios from "axios";
import jwt from "jsonwebtoken";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone: string;
      name: string;
      picode: string;
      // timestamp: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      return { ...token, ...user };
    },
    session: ({ session, token }) => {
      // session.user.waId = token.waId as string;
      session.user.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.picode = token.pincode as string;
      // session.user.timestamp = token.timestamp as string;
      session.user.name = token.name!;
      session.user.phone = token.phone as string;
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "wotmaster",
      credentials: {
        phone: { label: "phone", type: "text" },
        otp: { label: "otp", type: "text" },
        requestId: { label: "request", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) return null;
          if (!credentials.otp) {
            try {
              const truecallerAuth = await db.truecallerAuth.findFirst({
                where: {
                  requestId: credentials.requestId,
                },
              });
              const response = await axios.get(truecallerAuth?.endpoint ?? "", {
                headers: {
                  Authorization: `Bearer ${truecallerAuth?.accessToken}`,
                  "Cache-Control": "no-cache",
                },
              });
              console.log(response);
              const { data } = response as {
                data: {
                  id: string;
                  userId: number;
                  phoneNumbers: number[];
                  name: { first: string; last: string };
                  addresses: [{ countryCode: string }];
                  onlineIdentities: { email: string };
                  badges: [string];
                  avatarUrl: string;
                  history: null;
                  isActive: boolean;
                  gender: string;
                  privacy: string;
                  type: string;
                };
              };
              if (!data.phoneNumbers[0]) {
                throw new Error("No Number");
              }
              const { id, name, phone, pincode } = await db.user.upsert({
                where: {
                  phone: data.phoneNumbers[0].toString(),
                },
                create: {
                  name: data.name.first + " " + data.name.last,
                  phone: data.phoneNumbers[0].toString(),
                  image: data.avatarUrl,
                  isDeleted: false,
                },
                update: {
                  name: data.name.first + " " + data.name.last,
                  phone: data.phoneNumbers[0].toString(),
                  image: data.avatarUrl,
                  isDeleted: false,
                },
              });
              return {
                id,
                accessToken: jwt.sign(
                  {
                    id: id,
                    phone: phone,
                    name: name,
                    pincode,
                  },
                  env.NEXTAUTH_SECRET!,
                  {
                    expiresIn: 86400 * 30,
                  },
                ),
                phone: phone,
                name: name,
                pincode,
              };
            } catch (error) {
              console.log(error);
              throw new Error("Error check logs");
            }
          }
          const otp = await db.otpAuth.findUnique({
            where: {
              phone: credentials.phone,
            },
          });
          if (!otp?.otp) return null;

          if (otp.otp !== credentials.otp) throw new Error("Wrong OTP");
          const { id, name, phone, pincode } = await db.user.upsert({
            where: {
              phone: credentials.phone,
            },
            create: {
              name: "User",
              phone: credentials.phone,
              isDeleted: false,
            },
            update: {
              isDeleted: false,
            },
          });
          console.log(id, name, phone);
          return {
            id,
            accessToken: jwt.sign(
              {
                id: id,
              },
              env.NEXTAUTH_SECRET!,
              {
                expiresIn: 86400 * 30,
              },
            ),
            phone: phone,
            name: name,
            pincode,
          };
        } catch (error) {
          throw new Error("Wrong OTP");
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
