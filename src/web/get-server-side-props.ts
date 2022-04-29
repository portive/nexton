import { DateJsonObject } from "@portive/date-json"
import { GetServerSidePropsContext } from "next"
import { JsonObject } from "type-fest"
import * as s from "superstruct"
import { ParsedUrlQuery } from "querystring"
import * as Plugins from "~/src/plugins"
import { SideHandler, SideMethod, Transform } from "../types"

function withGetServerSideProps<Q extends ParsedUrlQuery, O extends JsonObject>(
  fn: Transform<Q, [GetServerSidePropsContext], O>
): SideHandler<Q, O> {
  const sideHandler = async (context: GetServerSidePropsContext) => {
    const query = context.query as Q
    const output = await fn(query, context)
    return { props: output }
  }
  return sideHandler as SideHandler<Q, O>
}

export function getServerSideProps<
  Q extends ParsedUrlQuery,
  O extends DateJsonObject
>(struct: s.Struct<Q>, fn: SideMethod<Q, O>) {
  const propsTransform = Plugins.withProps(struct, fn)
  const dateTransform = Plugins.withDate(propsTransform)
  const logTransform = Plugins.withLog(dateTransform)
  return withGetServerSideProps(logTransform)
}
