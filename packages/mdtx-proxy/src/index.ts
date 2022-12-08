import { config, app } from './server.js';

app.listen(config.port, () =>
  console.log(`Gatekeeper, at your service: http://localhost:${config.port}`),
);
