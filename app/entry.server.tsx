import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  responseHeaders.set('Content-Type', 'text/html')

  const html = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )
  return new Response('<!DOCTYPE html>' + html, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
