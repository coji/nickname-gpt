import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { trpc } from '../utils/trpc'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ReactQueryDevtools />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default trpc.withTRPC(MyApp)
