import * as express from 'express';
import * as proxy from 'express-http-proxy';
import { IncomingHttpHeaders } from 'http';
import { config } from './config';
import { authenticate } from './authenticate';

const app = express();

const port = (() => {
  if (process.env.FUNCTIONS_CUSTOMHANDLER_PORT) {
    const envPort = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT);
    if (isNaN(envPort) || !envPort) {
      throw new Error(
        `${process.env.FUNCTIONS_CUSTOMHANDLER_PORT} is not a valid value for FUNCTIONS_CUSTOMHANDLER_PORT`,
      );
    }
    return envPort;
  }
  return 3000;
})();

app.all('*', (_req, res, next) => {
  res.header('access-control-allow-origin', 'http://localhost:3000');
  res.header('access-control-allow-methods', 'GET, OPTIONS');
  res.header('access-control-allow-headers', 'Content-Type, Authorization');
  next();
});

app.get('/authenticate/:code', (req, res) =>
  authenticate(req.params.code, (err: string, token?: string) =>
    err || !token
      ? res.send({ error: err || 'bad_code' })
      : res.send({ token }),
  ),
);

const corsHeaders = (headers: IncomingHttpHeaders) => {
  headers['access-control-allow-origin'] = 'http://localhost:3000';
  headers['access-control-allow-methods'] = 'GET, OPTIONS';
  headers['access-control-allow-headers'] = 'Content-Type, Authorization';
  return headers;
};

app.use(
  '/api',
  proxy('api.github.com', {
    https: true,
    proxyReqPathResolver: (req) => req.url.replace(/^\/api/, ''),
    userResHeaderDecorator(headers) {
      if (headers.location) {
        const url = new URL(headers.location);
        if (url.host.includes('codeload')) {
          url.pathname = '/codeload' + url.pathname;
          headers.location =
            config.host + `:${port}` + url.pathname.replace('legacy.', '');
        }
      }
      return corsHeaders(headers);
    },
  }),
);

app.use(
  '/codeload',
  proxy('codeload.github.com', {
    https: true,
    proxyReqPathResolver: (req) => req.url,
    userResHeaderDecorator: corsHeaders,
    filter: (req) => req.method !== 'OPTIONS',
  }),
);

app.options('/codeload/*', (_, res) => res.send('OK'));

app.listen(port, () =>
  console.log(`MDtx-proxy running on: http://localhost:${port}`),
);
