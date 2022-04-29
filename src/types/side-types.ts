import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import { JsonObject } from "type-fest"
export * from "./json-date"

/**
 * Defines a NextJS GetServerSideProps handler adding two important properties
 * we can use to extract the `Query` and the `
 */
export type SideHandler<O extends JsonObject> = (
  context: SideContext
) => Promise<GetServerSidePropsResult<O>> & { PageProps: O }

/**
 * Defines a valid simple method function to be passed into getServerSideProps
 */
export type SideMethod<Q, O> = (query: Q, context: SideContext) => Promise<O>

/**
 * Defines a non-generic Context for getServerSideProps
 *
 * NOTE: We use a non-generic one because passing through a generic isn't
 * valuable since we aren't transforming the input query and this also causes
 * a lot of typing headaches.
 */
export type SideContext = GetServerSidePropsContext<ParsedUrlQuery>
