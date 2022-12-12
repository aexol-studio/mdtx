import * as express from "express";
import * as proxy from "express-http-proxy";
import { IncomingHttpHeaders } from "http";
import { config } from "./config";
import { authenticate } from "./authenticate";

const app = express();

app.all("*", (_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/authenticate/:code", (req, res) =>
  authenticate(req.params.code, (err: string, token?: string) =>
    err || !token ? res.send({ error: err || "bad_code" }) : res.send({ token })
  )
);

const corsHeaders = (headers: IncomingHttpHeaders) => {
  headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
  headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  return headers;
};

app.use(
  "/api",
  proxy("api.github.com", {
    https: true,
    proxyReqPathResolver: (req) => req.url.replace(/^\/api/, ""),
    userResHeaderDecorator(headers) {
      if (headers.location) {
        const url = new URL(headers.location);
        if (url.host.includes("codeload")) {
          url.pathname = "/codeload" + url.pathname;
          headers.location = config.host + url.pathname.replace("legacy.", "");
        }
      }
      return corsHeaders(headers);
    },
  })
);
app.use(
  "/codeload",
  proxy("codeload.github.com", {
    https: true,
    proxyReqPathResolver: (req) => req.url,
    userResHeaderDecorator: corsHeaders,
    filter: (req) => req.method !== "OPTIONS",
  })
);

app.options("/codeload/*", (_, res) => res.send("OK"));

app.listen(config.port, () =>
  console.log(`MDtx-proxy running on: http://localhost:${config.port}`)
);
