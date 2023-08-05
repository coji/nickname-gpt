import { useRouteLoaderData } from '@remix-run/react'
import type { SessionUser } from '~/services/session.server'

export const useSessionUser = () => {
  const rootRouteData = useRouteLoaderData('root') as { user?: SessionUser }
  const { user } = rootRouteData
  return user
}
