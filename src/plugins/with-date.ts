import { DateJsonObject, DateJsonToJson, toJsonValue } from "ejson-date"
import { GenericMethod } from "../types"

/**
 * Adds Date support to return values by converting them from DateJsonObject
 * to a plain JsonObject
 */
export function withDate<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends DateJsonObject
>(fn: GenericMethod<I, Args, O>): GenericMethod<I, Args, DateJsonToJson<O>> {
  const nextFn = async function (props: I, ...args: Args) {
    const response = await fn(props, ...args)
    return toJsonValue(response)
  }
  return nextFn
}
