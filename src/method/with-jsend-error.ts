import { Method } from "../types"
import { JSendError } from "./with-jsend"
import { NextApiRequest, NextApiResponse } from "next"

export function withJSendError<P, R>(fn: Method<P, R>) {
  const nextMethod: Method<P, R | JSendError> = async function (
    props: P,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const response = await fn(props, req, res)
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
