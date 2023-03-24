import { useRouteLoaderData } from '@remix-run/react'
import type { SessionUser } from '~/services/session.server'

export const useUser = () => {
  const rootRouteData = useRouteLoaderData('routes/_index')
  const { user } = rootRouteData as { user: SessionUser }
  return user
}
