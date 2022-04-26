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

// type HandlerOptions = {
//   cors?: boolean
// }

export function handler<
  P extends JsonObject,
  R extends DateJsonObject & JSendObject
>(
  struct: s.Struct<P>,
  method: Method<P, R>
  // { cors = false }: HandlerOptions = {}
) {
  const handler = withHandler(
    withLog(withJSendError(withDate(withJSend(withProps(struct, method)))))
  )
  // if (cors) {
  //   withCor
  // }
  return handler
}
