import * as DateJson from "@portive/date-json"
import { DateJsonObject } from "@portive/date-json"
import { GenericMethod } from "../types"

/**
 * Adds Date support to return values by converting them from DateJsonObject
 * to a plain JsonObject
 */
export function withDate<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends DateJsonObject
>(
  fn: GenericMethod<I, Args, O>
): GenericMethod<I, Args, DateJson.DateJsonToJson<O>> {
  const nextFn = async function (props: I, ...args: Args) {
    const response = await fn(props, ...args)
    return DateJson.toJsonValue(response)
  }
  return nextFn
}
