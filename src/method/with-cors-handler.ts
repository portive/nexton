import NextCors from "nextjs-cors"
import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject } from "type-fest"
import { Handler } from "../types"

/**
 * Add CORS support to a method.
 *
 * Pass in the method which can be a call to `djmethod` as an example and
 * this will add CORS support to that method.
 *
 * https://www.npmjs.com/package/nextjs-cors
 * https://nextjs.org/docs/api-routes/api-middlewares
 */

export function withCorsHandler<P extends JsonObject, R extends JsonObject>(
  handler: Handler<P, R>
): Handler<P, R> {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
    return await handler(req, res)
  } as unknown as Handler<P, R>
}
