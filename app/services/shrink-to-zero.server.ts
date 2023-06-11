export const status = { wokeUpAt: Date.now() }

let sleepTimeout: NodeJS.Timeout

export const keepAwake = () => {
  // production only
  if (process.env.NODE_ENV !== 'production') return
  if (sleepTimeout) clearTimeout(sleepTimeout)
  sleepTimeout = setTimeout(() => process.exit(0), 60_000)
}
