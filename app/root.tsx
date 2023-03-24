import { ChakraProvider } from '@chakra-ui/react'
import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

export const meta: V2_MetaFunction = () => [
  {
    title: 'Nickname GPT',
  },
  {
    charSet: 'utf-8',
  },
  {
    name: 'viewport',
    content: 'width=device-width,initial-scale=1',
  },
  {
    name: 'description',
    content: 'AI generates nicknames from IDs and email addresses.',
  },
]

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
