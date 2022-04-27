import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject } from "type-fest"
import * as debug from "../debug"
import { Method } from "../types"

let lastId = 0

export function withLog<P extends JsonObject, R extends JsonObject>(
  fn: Method<P, R>
): Method<P, R> {
  return async function (
    props: P,
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<R> {
    /**
     * Keep track of the current `id` so that when we `console.log` details
     * of the execution, we can match the start of the request with the end.
     */
    lastId++
    const id = lastId
    const startAt = Date.now()

    /**
     * Debug Request Info
     */
    debug.request(id, props)

    try {
      const response = await fn(props, req, res)
      const diff = Date.now() - startAt
      /**
       * Debug Response Info
       */
      debug.response(id, diff, response)
      return response
    } catch (e: unknown) {
      const error = e as Error
      /**
       * Debug Error Info
       */
      debug.error(id, error)
      throw e
    }
  }
}
