import https from 'https';
import qs from 'querystring';
import express from 'express';
import proxy from 'express-http-proxy';
import { IncomingHttpHeaders } from 'http';

export const app = express();

const requriedEnv = <T extends string>(...envs: T[]): Record<T, string> =>
  envs.reduce((pv, cv: T) => {
    const env = process.env[cv];
    if (!env) {
      throw new Error(`${cv} not set`);
    }
    return { ...pv, [cv]: env };
  }, {} as Partial<Record<T, string>>) as Record<T, string>;

const optionalEnv = <T extends string>(
  ...envs: T[]
): Partial<Record<T, string>> =>
  envs.reduce(
    (pv, cv: T) => ({
      ...pv,
      ...(process.env[cv] && { [cv]: process.env[cv] }),
    }),
    {} as Partial<Record<T, string>>,
  );

const {
  PROXY_HOST: host = 'http://localhost:9999',
  port: port = '9999',
  github: {
    GITHUB_APPLICATION_CLIENT_ID: clientId,
    GITHUB_APPLICATION_CLIENT_SECRET: clientSecret,
    GITHUB_APPLICATION_CLIENT_HOST: ghHost = 'github.com',
    GITHUB_APPLICATION_CLIENT_PORT: ghPort = '443',
    GITHUB_APPLICATION_CLIENT_PATH: path = '/login/oauth/access_token',
    GITHUB_APPLICATION_CLIENT_METHOD: method = 'POST',
  },
} = {
  github: {
    ...requriedEnv(
      'GITHUB_APPLICATION_CLIENT_ID',
      'GITHUB_APPLICATION_CLIENT_SECRET',
    ),
    ...optionalEnv(
      'PROXY_HOST',
      'GITHUB_APPLICATION_CLIENT_HOST',
      'GITHUB_APPLICATION_CLIENT_PORT',
      'GITHUB_APPLICATION_CLIENT_PATH',
      'GITHUB_APPLICATION_CLIENT_METHOD',
    ),
  },
  ...optionalEnv('PROXY_HOST', 'PORT'),
};
export const github = {
  clientId,
  clientSecret,
  host: ghHost,
  port: parseInt(ghPort),
  path,
  method,
};
export const config = { host, port };
if (isNaN(github.port)) {
  throw new Error('port must be a nubmer');
}

function authenticate(code, cb) {
  const data = qs.stringify({
    client_id: github.clientId,
    client_secret: github.clientSecret,
    code: code,
  });

  const reqOptions = {
    host: github.host,
    port: github.port,
    path: github.path,
    method: github.method,
    headers: { 'content-length': data.length },
  };

  let body = '';
  const req = https.request(reqOptions, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      cb(null, qs.parse(body).access_token);
    });
  });

  req.write(data);
  req.end();
  req.on('error', function (e) {
    cb(e.message);
  });
}

// Convenience for allowing CORS on routes - GET only
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/authenticate/:code', (req, res) =>
  authenticate(req.params.code, (err, token) =>
    err || !token ? { error: err || 'bad_code' } : { token },
  ),
);

const corsHeaders = (headers: IncomingHttpHeaders) => {
  headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
  headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
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
          headers.location = config.host + url.pathname;
        }
      }
      return corsHeaders(headers);
    },
  }),
);
///`https://codeload.github.com/aexol-studio/mdtx/legacy.zip/refs/heads/develop`
app.use(
  '/codeload',
  proxy('codeload.github.com', {
    https: true,
    proxyReqPathResolver: (req) => {
      console.log(req);

      return ``;
    },

    userResHeaderDecorator: corsHeaders,
    filter: (req) => req.method !== 'OPTIONS',
  }),
);

app.options('/codeload/*', (_, res) => 'OK');
