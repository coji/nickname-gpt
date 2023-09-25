import {
  type LinksFunction,
  type MetaFunction,
  type LoaderFunctionArgs,
  json,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { createHead } from 'remix-island'
import { authenticator } from './services/auth.server'
import globalCss from './styles/globals.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalCss },
]

export const meta: MetaFunction = () => [
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionUser = await authenticator.isAuthenticated(request)
  return json({ user: sessionUser })
}

export default function App() {
  return (
    <>
      <Head />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
