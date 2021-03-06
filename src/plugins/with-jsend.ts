import { GenericMethod } from "../types"

/**
 * djsend related types and method. Same as `jsend` but accepts `Date` objects
 * in the `data` payloads.
 */

/**
 * A successful JSend response. Importantly, the data returns must be a
 * JsonObject.
 */
export type JSendSuccess = { status: "success"; data: unknown }

/**
 * A structured or predictable fail where we return information about the
 * failure.
 */
export type JSendFail = { status: "fail"; data: unknown }

/**
 * This shouldn't happen normally.
 */
export type JSendError = { status: "error"; message: string }

/**
 * The merged JSendObject which can be a success, fail or error
 */
export type JSendObject = JSendSuccess | JSendFail | JSendError

/**
 * Ensures that the return value is a JSend Object.
 */
export function withJSend<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends JSendObject
>(fn: GenericMethod<I, Args, O>): GenericMethod<I, Args, O> {
  return fn
}
