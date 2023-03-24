import { redirect } from '@remix-run/node'
import { getSession } from '../session.server'

export const isAuthenticated = async (
  request: Request,
  options:
    | { successRedirect?: never; failureRedirect?: never }
    | { successRedirect: string; failureRedirect?: never }
    | { successRedirect?: never; failureRedirect: string }
    | { successRedirect: string; failureRedirect: string } = {},
) => {
  const session = await getSession(request)
  const uid = session.get('uid') ?? null
  if (uid) {
    if (options.successRedirect) throw redirect(options.successRedirect)
    else return uid
  }

  if (options.failureRedirect) throw redirect(options.failureRedirect)
  else return null
}
