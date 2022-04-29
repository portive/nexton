import { GetStaticPaths } from "next"
import { ParsedUrlQuery } from "querystring"
import { StaticPropsHandler } from "../types"
import { JsonObject } from "type-fest"

type InferParams<H extends StaticPropsHandler<ParsedUrlQuery, JsonObject>> =
  H extends StaticPropsHandler<infer P, JsonObject> ? P : never

/**
 * TODO:
 *
 * This sets the return type so that it matches the generic StaticPropsHandler
 * passed in; however, it does not do a strict equality check on the type for
 * some reason. In other words, if the `params` contains more properties than
 * required (e.g. it `extends`) then the type passes.
 *
 * Ideally, I don't think we want this behavior.
 */
export async function getStaticPaths<
  H extends StaticPropsHandler<ParsedUrlQuery, JsonObject>
>(fn: GetStaticPaths<InferParams<H>>) {
  return fn
}
