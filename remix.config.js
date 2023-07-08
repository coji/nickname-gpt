/* eslint-disable @typescript-eslint/require-await */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { flatRoutes } = require('remix-flat-routes')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
  serverModuleFormat: 'cjs',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    v2_headers: true,
    v2_dev: true,
  },
}
