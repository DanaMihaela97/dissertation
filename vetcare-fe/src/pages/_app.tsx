import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import '../styles/global.css';
import SseComponent from "@/components/Sse/SseComponent";

export default function MyApp({ Component, pageProps: {session, ...pageProps } }: AppProps) {
  return     (
  <SessionProvider session={session}>
    <SseComponent {...pageProps} />
    <Component {...pageProps} />
  </SessionProvider>
  )
}
