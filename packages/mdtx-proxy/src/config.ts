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
  PROXY_HOST: host,
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
  ...optionalEnv('PROXY_HOST'),
};

export const github = {
  clientId,
  clientSecret,
  host: ghHost,
  port: parseInt(ghPort),
  path,
  method,
};

export const config = { host };
if (isNaN(github.port)) {
  throw new Error('port must be a number');
}
