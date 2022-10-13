import fs from 'fs';

export const GLOBAL_CONFIG_FILE = {
  out: './src',
  in: './content',
};

export type ConfigFile = typeof GLOBAL_CONFIG_FILE;

export const validateConfig = (config: ConfigFile) => {
  const errors: string[] = [];
  // Validate config
  Object.keys(GLOBAL_CONFIG_FILE).forEach((key) => {
    const v = config[key as keyof ConfigFile];
    if (typeof v === 'undefined' || v === null) {
      errors.push(
        `Invalid config file. Please include "${key}" in your config`,
      );
    }
  });
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};

export const readConfig = (path: string) => {
  const configExists = fs.existsSync(path);
  if (!configExists) {
    throw new Error('No config for mdtx please create one using init');
  }
  try {
    const config: ConfigFile = JSON.parse(
      fs.readFileSync(path).toString('utf8'),
    );
    validateConfig(config);
    return config;
  } catch (error) {
    throw new Error('Invalid JSON file');
  }
};

export const initConfig = async (values = GLOBAL_CONFIG_FILE) => {
  fs.writeFileSync('mdtx.json', JSON.stringify(values, null, 4));
};
