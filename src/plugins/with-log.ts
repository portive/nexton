import * as debug from "../debug"
import { GenericMethod } from "~/src/types"

let lastId = 0

/**
 * Adds input and output logging so developers can easily see what's
 * happening in their terminal while they are developing.
 */
export function withLog<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends Record<string, unknown>
>(
  inputCaption: string,
  outputCaption: string,
  fn: GenericMethod<I, Args, O>
): GenericMethod<I, Args, O> {
  return async function (input: I, ...args: Args): Promise<O> {
    /**
     * Keep track of the current `id` so that when we `console.log` details
     * of the execution, we can match the start of the request with the end.
     */
    lastId++
    const id = lastId
    const startAt = Date.now()

    /**
     * Debug Request Info
     */
    debug.output(inputCaption, id, input)

    try {
      const response = await fn(input, ...args)
      const diff = Date.now() - startAt
      /**
       * Debug Response Info
       */
      debug.output(outputCaption, id, response, diff)
      return response
    } catch (e: unknown) {
      const error = e as Error
      /**
       * Debug Error Info
       */
      debug.error(id, error)
      throw e
    }
  }
}
