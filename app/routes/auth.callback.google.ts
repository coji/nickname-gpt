import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { createForwardedRequest } from '~/utils/helpers'

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.authenticate('google', createForwardedRequest(request), {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}
