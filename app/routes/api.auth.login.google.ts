import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { generateAuthUrl } from '~/services/auth/google.server'

export const loader = ({ request }: LoaderArgs) => {
  // TODO: state をセッションに入れてコールバックURLに渡す
  return redirect(generateAuthUrl(request, '555'))
}
