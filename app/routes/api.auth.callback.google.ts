import type { LoaderArgs } from '@remix-run/node'
import { fetchAccessToken, fetchUser } from '~/services/auth/google'

export const loader = async ({ request }: LoaderArgs) => {
  const accessToken = await fetchAccessToken(request)
  if (!accessToken) {
    throw new Error('No access token found in the response')
  }
  const user = await fetchUser(accessToken)
  if (!user) {
    throw new Error('No user found in the response')
  }

  return {
    accessToken,
    user,
  }
}
