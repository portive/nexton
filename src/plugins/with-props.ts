import { Transform } from "../types"
import * as s from "superstruct"
import { createWithScopedErrors } from "~/src/utils/create-with-scoped-errors"

export function withProps<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends Record<string, unknown>
>(struct: s.Struct<I>, fn: Transform<I, Args, O>): Transform<I, Args, O> {
  const nextFn = async function (props: I, ...args: Args) {
    const nextProps = createWithScopedErrors(
      props,
      struct,
      "Error validating input props"
    )
    return await fn(nextProps, ...args)
  }
  return nextFn
}
