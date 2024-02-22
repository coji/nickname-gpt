import {
  json,
  LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { authenticator } from './services/auth.server'
import globalStyles from './styles/globals.css?url'

export const meta: MetaFunction = () => [
  { title: 'Nickname GPT' },
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  {
    name: 'description',
    content: 'AI generates nicknames from IDs and email addresses.',
  },
]

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessionUser = await authenticator.isAuthenticated(request)
  return json({ user: sessionUser })
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
