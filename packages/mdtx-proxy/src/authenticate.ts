import * as https from "https";
import * as qs from "qs";
import { Response } from "express-serve-static-core";
import { github } from "./config";

export const authenticate = (
  code: string,
  cb: {
    (err: string, token?: string | undefined): Response<
      any,
      Record<string, any>,
      number
    >;
    (
      arg0: string | null,
      arg1: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined
    ): void;
  }
) => {
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
    headers: { "content-length": data.length },
  };
  let body = "";
  const req = https.request(reqOptions, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      cb(null, qs.parse(body).access_token);
    });
  });
  req.write(data);
  req.end();
  req.on("error", function (e) {
    cb(e.message);
  });
};
