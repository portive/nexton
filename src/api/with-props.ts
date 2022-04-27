import { NextApiRequest, NextApiResponse } from "next"
import { Method } from "../types"
import * as s from "superstruct"

export function withProps<P, R>(
  struct: s.Struct<P>,
  fn: Method<P, R>
): Method<P, R> {
  const nextFn = async function (
    props: P,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const nextProps = s.create(props, struct)
      const response = await fn(nextProps, req, res)
      return response
    } catch (e) {
      if (e instanceof s.StructError) {
        e.name = "Error validating API method props"
      }
      throw e
    }
  }
  return nextFn
}
