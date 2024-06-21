import Head from 'next/head'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import React from 'react'

import { theme } from '../styles/theme'
import { ThemeProvider } from '@material-ui/core/styles';

import '../styles/global.css'
import '../lib/firebaseApp'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Seed Hunt</title>
    </Head>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ThemeProvider>
    </React.StrictMode>
  </>
}