import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import '../styles/global.css';

export default function MyApp({ Component, pageProps: {session, ...pageProps } }: AppProps) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
  )
  // return     (
  //     <SessionProvider session={session}>
  //       <Component {...pageProps} />
  //     </SessionProvider>
  // )
}
