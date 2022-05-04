import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
} from "next"
import { ParsedUrlQuery } from "querystring"
import { JsonObject } from "type-fest"
export * from "./json-date"

/**
 * Defines a non-generic Context for getServerSideProps
 *
 * NOTE: We use a non-generic one because passing through a generic isn't
 * valuable since we aren't transforming the input query and this also causes
 * a lot of typing headaches.
 */
export type SideContext = GetServerSidePropsContext<ParsedUrlQuery>

/**
 * Defines a valid simple method function to be passed into getServerSideProps
 */
export type SideMethod<Q, O> = (query: Q, context: SideContext) => Promise<O>

/**
 * Defines a NextJS GetServerSideProps handler adding two important properties
 * we can use to extract the `Query` and the `
 */
export type SideHandler<O extends JsonObject> = (
  context: SideContext
) => Promise<GetServerSidePropsResult<O>> & { PageProps: O }

export type StaticPropsContext = GetStaticPropsContext<ParsedUrlQuery>
export type StaticPropsMethod<P, O> = (
  params: P,
  context: StaticPropsContext
) => Promise<O>
export type StaticPropsHandler<
  /**
   * I'm not 100% on this at the time I wrote this comment, but I believe this
   * is needed so that when we pass around this type, the `Q` type is available
   * so that we can use it elsewhere by inferring from it.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Q extends ParsedUrlQuery,
  O extends JsonObject
> = (context: StaticPropsContext) => Promise<O> & { PageProps: O }
