import { config, app } from './server.js';

app.listen(config.port, () =>
  console.log(`MDtx-proxy running on: http://localhost:${config.port}`),
);
