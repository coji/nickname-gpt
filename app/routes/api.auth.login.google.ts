import type { LoaderArgs } from '@remix-run/node'
import { authenticate } from '~/services/auth/google.server'

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticate(request)
}
