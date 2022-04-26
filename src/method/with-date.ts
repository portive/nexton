import { NextApiRequest, NextApiResponse } from "next"
import { Method } from "../types"
import * as DateJson from "@portive/date-json"
import { DateJsonObject } from "@portive/date-json"

export function withDate<P extends DateJsonObject, R extends DateJsonObject>(
  fn: Method<P, R>
): Method<P, DateJson.DateJsonToJson<R>> {
  const nextFn = async function (
    props: P,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const response = await fn(props, req, res)
    return DateJson.toJsonValue(response)
  }
  return nextFn
}
