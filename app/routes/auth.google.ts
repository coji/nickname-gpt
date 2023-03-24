import type { LoaderArgs } from '@remix-run/node'
import { setTimeout } from 'timers/promises'
import { authenticator } from '~/services/auth.server'
import { createForwardedRequest } from '~/utils/helpers'

export const loader = async ({ request }: LoaderArgs) => {
  await setTimeout(1000)
  return await authenticator.authenticate(
    'google',
    createForwardedRequest(request),
    {
      successRedirect: '/',
      failureRedirect: '/login',
    },
  )
}
