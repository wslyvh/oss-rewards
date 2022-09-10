import 'assets/globals.scss'
import { Layout } from 'components/Layout'
import { SEO } from 'components/SEO'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <SEO />
      <Component {...pageProps} />
    </Layout>
  )
}
