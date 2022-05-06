import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject } from "type-fest"
import { APIHandler, APIMethod } from "../types"
import * as debug from "../../src/debug"

let lastId = 0

/**
 * Converts an API method (which is a more simplified form of the API definition)
 * and returns a NextJS compatible handler.
 */
export function withHandler<
  Props extends JsonObject,
  Response extends JsonObject
>(
  fn: APIMethod<Props, Response>,
  { log }: { log: boolean }
): APIHandler<Props, Response> {
  const handler = async function (req: NextApiRequest, res: NextApiResponse) {
    /**
     * Keep track of the current `id` so that when we `console.log` details
     * of the execution, we can match the start of the request with the end.
     */
    lastId++
    const id = lastId
    const startAt = Date.now()

    const props = req.body

    if (log) {
      debug.output({
        title: "API Request",
        id,
        info: req.url,
        value: props,
      })
    }
    try {
      const response = await fn(props, req, res)
      const diff = Date.now() - startAt
      /**
       * Debug Response Info
       */
      if (log) {
        debug.output({
          title: "API Response",
          id,
          info: req.url,
          value: response,
          diff,
        })
      }
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
      if (log) debug.error(id, error)
      res.status(500).send(error.stack)
    }
  }
  return handler as unknown as APIHandler<Props, Response>
}
