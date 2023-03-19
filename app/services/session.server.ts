import { createCookieSessionStorage } from '@remix-run/node'
import invariant from 'tiny-invariant'
invariant(
  process.env.SESSION_SECRET,
  'SESSION_SECRET environment variable should defined',
)

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}
