import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";

import "@/styles/globals.css";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("./layout"), { ssr: false });
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          {/* <link rel="manifest" href="/manifest.json" /> */}
          {/* <link rel="apple-touch-icon" href="/icon.png"></link> */}
          <meta name="theme-color" content="#fff" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <main className={GeistSans.className}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
