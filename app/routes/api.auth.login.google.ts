import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { generateAuthUrl } from '~/services/auth/google.server'

export const loader = ({ request }: LoaderArgs) =>
  redirect(generateAuthUrl(request))
