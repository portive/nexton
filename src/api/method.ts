import { DateJsonObject } from "ejson-date"
import * as s from "superstruct"
import { JsonObject } from "type-fest"
import { JSendObject } from "../plugins/with-jsend"
import { APIMethod } from "../types"
import { withHandler } from "./with-handler"
import { withDate } from "../plugins/with-date"
import { withJSend } from "../plugins/with-jsend"
import { withJSendError } from "../plugins/with-jsend-error"
import { withProps } from "../plugins/with-props"
import { withCorsHandler } from "./with-cors-handler"

type HandlerOptions = {
  cors?: boolean // false
  log?: boolean
}

/**
 * Create an API Handler
 */
export function handler<
  P extends JsonObject,
  R extends DateJsonObject //& JSendObject
>(
  struct: s.Struct<P>,
  method: APIMethod<P, R>,
  { log = true, cors = false }: HandlerOptions = {}
) {
  const propsMethod = withProps(struct, method)
  const dateMethod = withDate(propsMethod)
  const handler = withHandler(dateMethod, { log })
  const maybeCorsHandler = cors ? withCorsHandler(handler) : handler
  return maybeCorsHandler
}

/**
 * Create an API Handler with support for jsend built into it.
 */
export function jsend<
  P extends JsonObject,
  R extends DateJsonObject & JSendObject
>(
  struct: s.Struct<P>,
  method: APIMethod<P, R>,
  { log = true, cors = false }: HandlerOptions = {}
) {
  const propsMethod = withProps(struct, method)
  const jsendMethod = withJSend(propsMethod)
  const jsendErrorMethod = withJSendError(jsendMethod)
  const dateMethod = withDate(jsendErrorMethod)
  const handler = withHandler(dateMethod, { log })
  const maybeCorsHandler = cors ? withCorsHandler(handler) : handler
  return maybeCorsHandler
}
