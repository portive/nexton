import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject } from "type-fest"

/**
 * Defines a NextJs handler adding two important properties we can use to
 * extract the `Props` and the `Response` types from.
 */
export type APIHandler<P extends JsonObject, R extends JsonObject> = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> & { Props: P; Response: R }

/**
 * Defines a valid API method function to be passed in.
 */
export type APIMethod<P, R> = (
  props: P,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<R>
