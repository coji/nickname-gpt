import { ChakraProvider } from '@chakra-ui/react'
import { type V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { createHead } from 'remix-island'

export const meta: V2_MetaFunction = () => [
  { title: 'Nickname GPT' },
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  {
    name: 'description',
    content: 'AI generates nicknames from IDs and email addresses.',
  },
]

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))

export default function App() {
  return (
    <>
      <Head />
      <ChakraProvider resetCSS>
        <Outlet />
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
