import { Links, Meta } from '@remix-run/react'
import { createHead } from 'remix-island'

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))
