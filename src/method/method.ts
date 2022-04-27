import { DateJsonObject } from "@portive/date-json"
import * as s from "superstruct"
import { JsonObject } from "type-fest"
import { JSendObject } from "./with-jsend"
import { Method } from "../types"
import { withHandler } from "./with-handler"
import { withLog } from "./with-log"
import { withDate } from "./with-date"
import { withJSend } from "./with-jsend"
import { withJSendError } from "./with-jsend-error"
import { withProps } from "./with-props"
import { withCorsHandler } from "./with-cors-handler"

type HandlerOptions = {
  cors?: boolean // false
  log?: boolean
}

export function handler<
  P extends JsonObject,
  R extends DateJsonObject & JSendObject
>(
  struct: s.Struct<P>,
  arg1: Method<P, R> | HandlerOptions,
  arg2?: Method<P, R> | undefined
) {
  const method = getMethod(arg1, arg2)
  const options = getOptions(typeof arg1 === "function" ? {} : arg1)
  const propsMethod = withProps(struct, method)
  const jsendMethod = withJSend(propsMethod)
  const jsendErrorMethod = withJSendError(jsendMethod)
  const dateMethod = withDate(jsendErrorMethod)
  const maybeLogMethod = options.log ? withLog(dateMethod) : dateMethod
  const handler = withHandler(maybeLogMethod)
  const maybeCorsHandler = options.cors ? withCorsHandler(handler) : handler
  return maybeCorsHandler
}

function getMethod<P, R>(
  arg1: Method<P, R> | HandlerOptions,
  arg2?: Method<P, R> | undefined
) {
  if (typeof arg1 === "function") {
    return arg1
  } else if (typeof arg2 === "function") {
    return arg2
  } else {
    throw new Error(`Expected a function for argument 2 or 3`)
  }
}

function getOptions({ cors = false, log = true }: HandlerOptions) {
  return { cors, log }
}
