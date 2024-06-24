import Head from 'next/head'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import React from 'react'

import { theme } from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles';

import '../styles/global.css'
import '../lib/firebaseApp'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Seed Hunt</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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