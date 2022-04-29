import { Server } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject } from "type-fest"
import { APIHandler, APIMethod } from "../types"

/**
 * Converts an API method (which is a more simplified form of the API definition)
 * and returns a NextJS compatible handler.
 */
export function withHandler<
  Props extends JsonObject,
  Response extends JsonObject
>(fn: APIMethod<Props, Response>): APIHandler<Props, Response> {
  const handler = async function (req: NextApiRequest, res: NextApiResponse) {
    const props = req.body
    try {
      const response = await fn(props, req, res)
      res.status(200).json(response)
    } catch (e: unknown) {
      /**
       * If there is an unhandled error that reaches the handler, we send it
       * to the browser as a `500` error.
       *
       * Note that some plugins might intercept the error and so will send a
       * 200 status but add the error to the body. For example, in a JSend
       * Error.
       */
      const error = e as Error
      res.status(500).send(error.stack)
    }
  }
  return handler as unknown as APIHandler<Props, Response>
}
