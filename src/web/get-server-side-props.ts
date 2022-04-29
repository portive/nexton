import { DateJsonObject } from "@portive/date-json"
import { JsonObject } from "type-fest"
import * as s from "superstruct"
import { ParsedUrlQuery } from "querystring"
import * as Plugins from "~/src/plugins"
import { SideHandler, SideContext, SideMethod } from "../types"
import { GetServerSidePropsResult } from "next"
import { WebResponse } from "./web-response"

function withGetServerSideProps<Q extends ParsedUrlQuery, O extends JsonObject>(
  fn: SideMethod<Q, O>
): SideHandler<O> {
  const handler = async function (
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
    try {
      const output = await fn(query, context)
      return { props: output }
    } catch (e) {
      if (e instanceof WebResponse) {
        /**
         * This is hacky, but it's okay. If a `WebResponse` is thrown and
         * caught here, it probably means one of two things have happened.
         * Either a `notFound` or a `redirect`. None of these affect the
         * output value that we need to get the input props for the Page.
         *
         * It is possible that in the future `WebResponse` could throw a
         * `props` response which could have an affect, but in that scenario,
         * you should probably be using `return` instead of the throwing out
         * method and in if you insist on doing so, we should probably presume
         * you know what you're doing and it's handling a special use case.
         *
         * If that were to happen, you may have to manually override the
         * generic to include the special case.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return e.value as any
      }
      throw e
    }
  }
  return handler as unknown as SideHandler<O>
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
  return withGetServerSideProps(logTransform)
}
