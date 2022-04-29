import * as DateJson from "@portive/date-json"
import { DateJsonObject } from "@portive/date-json"
import { Transform } from "../types"

export function withDate<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends DateJsonObject
>(fn: Transform<I, Args, O>): Transform<I, Args, DateJson.DateJsonToJson<O>> {
  const nextFn = async function (props: I, ...args: Args) {
    const response = await fn(props, ...args)
    return DateJson.toJsonValue(response)
  }
  return nextFn
}
