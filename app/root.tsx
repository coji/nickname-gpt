import { ChakraProvider } from '@chakra-ui/react'
import { type LoaderArgs, type MetaFunction, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Nickname GPT',
  viewport: 'width=device-width,initial-scale=1',
})

interface DocumentProps {
  children: React.ReactNode
}

export const loader = ({ request, context }: LoaderArgs) => json({})
const Document = ({ children }: DocumentProps) => {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <ChakraProvider resetCSS>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}
