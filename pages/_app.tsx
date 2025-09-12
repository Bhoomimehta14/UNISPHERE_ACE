import '../app/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>UNISPHERE - Campus Management System</title>
        <meta name="description" content="UNISPHERE - A comprehensive campus management platform connecting students, faculty, and administrators worldwide" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}