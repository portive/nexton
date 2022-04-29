import { DateJson, JsonToDateJson } from "@portive/date-json"
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import React from "react"
import { JsonObject } from "type-fest"
import { getServerSideProps } from "./get-server-side-props"
export * from "./get-server-side-props"

/**
 * NOTE:
 *
 * When working on this code, the GSSP is provided and not inferred. This is
 * why we don't capture a simpler generic like `Props`
 */
function page<GSSP extends GetServerSideProps<JsonObject>>(
  fn: NextPage<JsonToDateJson<InferGetServerSidePropsType<GSSP>>>
) {
  type Props = InferGetServerSidePropsType<GSSP>
  return function ({ children, ...jsonProps }: React.PropsWithChildren<Props>) {
    const dateJsonProps = DateJson.fromJsonValue(jsonProps)
    // if (fn instanceof React.Component) {
    //   throw new Error(`Web.page works with function components only`)
    // }

    /**
     * This works but it has been challenging to get the type issues to
     * disappear.
     *
     * The problem is that `fn` could be a React.Component but I can't find a
     * way to discriminate `fn` to only be a Function component. The code above
     * `fn instanceof React.Component` doesn't seem to do the trick.
     */
    // TODO: Remove the @ts-ignore (see details above)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return fn({ children, ...dateJsonProps })
  }
}

export const Web = {
  getServerSideProps,
  page,
}
