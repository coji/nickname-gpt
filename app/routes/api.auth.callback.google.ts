import type { LoaderArgs } from '@remix-run/node'
import { fetchGoogleUser } from '~/services/auth/google.server'

export const loader = async ({ request }: LoaderArgs) => {
  // TODO: セッション読み込み state を確認した上で問題なければログイン確認

  const user = await fetchGoogleUser(request)
  if (!user) {
    throw new Error('No user found in the response')
  }

  return {
    user,
  }
}
