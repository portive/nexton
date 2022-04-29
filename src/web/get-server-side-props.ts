import { DateJsonObject } from "@portive/date-json"
import { JsonObject } from "type-fest"
import * as s from "superstruct"
import { ParsedUrlQuery } from "querystring"
import * as Plugins from "~/src/plugins"
import { SideHandler, SideContext, SideMethod } from "../types"
import { GetServerSidePropsResult } from "next"

function withGetServerSideProps<Q extends ParsedUrlQuery, O extends JsonObject>(
  fn: SideMethod<Q, O>
): SideHandler<O> {
  return async function (
    context: SideContext
  ): Promise<GetServerSidePropsResult<O>> {
    /**
     * I can't get this to type properly without typecasting `context.query`
     * to Q. The problem is that `context.query` will never be typed properly
     * using the Next.js types for the Context because `["query"]` is typed
     * as `ParsedUrlQuery` instead of `Q` (i.e. the generic in the definition
     * of `GetServerSidePropsContext`)
     */
    const query = context.query as Q
    const output = await fn(query, context)
    return { props: output }
  }
}

export function getServerSideProps<
  Q extends ParsedUrlQuery,
  O extends DateJsonObject
>(struct: s.Struct<Q>, fn: SideMethod<Q, O>) {
  const propsTransform = Plugins.withProps(struct, fn)
  const dateTransform = Plugins.withDate(propsTransform)
  const logTransform = Plugins.withLog(
    "SideProps Query",
    "SideProps Output",
    dateTransform
  )
  const handler = withGetServerSideProps(logTransform)
  return handler
}
