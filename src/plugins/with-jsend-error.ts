import { JSendError } from "./with-jsend"
import { GenericMethod } from "~/src/types"

export function withJSendError<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends Record<string, unknown>
>(fn: GenericMethod<I, Args, O>) {
  const nextMethod: GenericMethod<I, Args, O | JSendError> = async function (
    input: I,
    ...args: Args
  ) {
    try {
      const response = await fn(input, ...args)
      return response
    } catch (e) {
      if (e instanceof Error) {
        const jsendError: JSendError = {
          status: "error",
          message: `${e.stack}`,
        }
        return jsendError
      } else {
        throw e
      }
    }
  }
  return nextMethod
}
