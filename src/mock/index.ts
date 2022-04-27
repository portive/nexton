import { NextApiRequest, NextApiResponse } from "next"
import { createMocks } from "node-mocks-http"
import { JsonObject } from "type-fest"
import { Method } from "../types"

/**
 * Executes a minimal fake method call against a NextJS compatible API handler
 * and returns a tuple with `[returnValue, req, res]`
 */
export async function callHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  json: JsonObject
): Promise<[unknown, NextApiRequest, NextApiResponse]> {
  /**
   * Create mock Request and Response objects
   */
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: "POST",
    body: json,
  })

  await handler(req, res)

  const isJSON = res._isJSON()

  /**
   * We return a rather verbose `statusCode` and `statusMessage` to remove
   * ambiguity. For example, if we used `message`, that might get confused
   * with the data that we are returning (which is kind of a message).
   *
   * It's just really clear when we say `statusCode` that we are referring to
   * the http `statusCode` as well and not, perhaps, the `status` inside the
   * body of the response.
   */
  if (isJSON) {
    return [res._getJSONData(), req, res]
  } else {
    return [res._getData(), req, res]
  }
}

/**
 * Executes a minimal fake method call against a bare bones method that hasn't
 * been converted into a `Handler` yet.
 */
export async function callMethod<P, R>(
  method: Method<P, R>,
  props: P
): Promise<R> {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: "POST",
    body: props,
  })
  const response = await method(props, req, res)
  return response
}
