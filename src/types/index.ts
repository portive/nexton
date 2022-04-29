import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { ParsedUrlQuery } from "querystring"
import { JsonObject } from "type-fest"
export * from "./json-date"

/**
 * Defines a NextJs handler adding two important properties we can use to
 * extract the `Props` and the `Response` types from.
 */
export type Handler<P extends JsonObject, R extends JsonObject> = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> & { Props: P; Response: R }

/**
 * Defines a valid API method function to be passed in.
 */
export type Method<P, R> = (
  props: P,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<R>

// export type PropsFunction<Q, R> = (
//   query: Q,
//   context: GetServerSidePropsContext
// ) => Promise<R>

// export type GetProps<I, R> = (input: I) => Promise<R>

/**
 * Defines a function type that takes a primary input and returns some sort of
 * primary output. It also allows for an arbitrary number of additional
 * arguments in the function to pass in other values. For example, an API
 * function would have a req and res, a getServerSideProps function has a
 * GetServerSidePropsContext.
 */
export type Transform<
  I extends Record<string, unknown>,
  Args extends unknown[],
  O extends Record<string, unknown>
> = (input: I, ...args: Args) => Promise<O>

/**
 * Defines a NextJS GetServerSideProps handler adding two important properties
 * we can use to extract the `Query` and the `
 */
export type SideHandler<Q extends ParsedUrlQuery, O extends JsonObject> = (
  context: GetServerSidePropsContext
) => Promise<{ props: O }> & { Query: Q; PageProps: O }

export type SideMethod<Q, O> = (
  query: Q,
  context: GetServerSidePropsContext
) => Promise<O>
