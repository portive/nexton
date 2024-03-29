import {
  StaticPropsContext,
  StaticPropsMethod,
  StaticPropsHandler,
} from "../types"
import { ParsedUrlQuery } from "querystring"
import { DateJsonObject } from "ejson-date"
import { JsonObject } from "type-fest"
import * as Plugins from "../plugins"
import * as s from "superstruct"
import { GetStaticPropsResult } from "next"
import { WebResponse } from "./web-response"

function withGetStaticProps<P extends ParsedUrlQuery, O extends JsonObject>(
  fn: StaticPropsMethod<P, O>
): StaticPropsHandler<P, O> {
  const handler = async function (
    context: StaticPropsContext
  ): Promise<GetStaticPropsResult<O>> {
    /**
     * I can't get this to type properly without typecasting `context.query`
     * to Q. The problem is that `context.query` will never be typed properly
     * using the Next.js types for the Context because `["query"]` is typed
     * as `ParsedUrlQuery` instead of `Q` (i.e. the generic in the definition
     * of `GetServerSidePropsContext`)
     */
    const params = context.params as P
    try {
      const output = await fn(params, context)
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
  return handler as unknown as StaticPropsHandler<P, O>
}

export function getStaticProps<
  P extends ParsedUrlQuery,
  O extends DateJsonObject
>(struct: s.Struct<P>, fn: StaticPropsMethod<P, O>) {
  const propsTransform = Plugins.withProps(struct, fn)
  const dateTransform = Plugins.withDate(propsTransform)
  const logTransform = Plugins.withLog(
    "StaticProps Params",
    "StaticProps Output",
    dateTransform
  )
  return withGetStaticProps(logTransform)
}
