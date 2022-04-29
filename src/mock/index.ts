import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"

export * from "./call"

export async function callSideHandler<
  Q extends ParsedUrlQuery,
  F extends GetServerSideProps
>(query: Q, fn: F) {
  const mockContext = { query } as unknown as GetServerSidePropsContext<Q>
  const result = await fn(mockContext)
  const props = "props" in result ? result.props : undefined
  return [props, result]
}
