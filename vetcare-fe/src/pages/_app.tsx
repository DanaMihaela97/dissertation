import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import '../styles/global.css';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
   getLayout?: (page: ReactElement) => ReactNode;
};

interface AppPropsWithLayout extends AppProps {
   Component: NextPageWithLayout;
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {

   const getLayout = Component.getLayout ?? ((page) => page);

   return getLayout(
      <SessionProvider session={session}>
         <Component {...pageProps} />
      </SessionProvider>
   )
}
