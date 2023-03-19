import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { createRequestHandler } from '@remix-run/express'
import { createMessagesStore } from '~/services/message-store.server'
import type { AppLoadContext } from '@remix-run/node'

const app = express()

app.use((req, res, next) => {
  // helpful headers:
  res.set('x-fly-region', process.env.FLY_REGION ?? 'unknown')
  res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`)

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safepath + query)
    return
  }
  next()
})

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all('*', function getReplayResponse(req, res, next) {
  const { method, path: pathname } = req
  const { PRIMARY_REGION, FLY_REGION } = process.env

  const isMethodReplayable = !['GET', 'OPTIONS', 'HEAD'].includes(method)
  const isReadOnlyRegion = FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION

  const shouldReplay = isMethodReplayable && isReadOnlyRegion

  if (!shouldReplay) return next()

  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION,
  }
  console.info(`Replaying:`, logInfo)
  res.set('fly-replay', `region=${PRIMARY_REGION}`)
  return res.sendStatus(409)
})

app.use(compression())
app.disable('x-powered-by')
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }))
app.use(express.static('public', { maxAge: '1h' }))
app.use(morgan('tiny'))

const MODE = process.env.NODE_ENV
const BUILD_DIR = path.join(process.cwd(), 'build')

const messageStore = createMessagesStore()
app.all(
  '*',
  MODE === 'production'
    ? createRequestHandler({
        build: require(BUILD_DIR),
        getLoadContext: (req, res) =>
          ({messageStore} satisfies AppLoadContext),
      })
    : (...args) => {
        purgeRequireCache()
        const requestHandler = createRequestHandler({
          build: require(BUILD_DIR),
          getLoadContext: (req, res) =>
            ({messageStore} satisfies AppLoadContext),
          mode: MODE,
        })
        return requestHandler(...args)
      },
)

const port = process.env.PORT || 3000

app.listen(port, () => {
  require(BUILD_DIR)
  console.log(`✅ app ready: http://localhost:${port}`)
})

function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}
