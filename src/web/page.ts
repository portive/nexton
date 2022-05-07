import { JsonToDateJson, DateJson } from "@portive/date-json"
import { NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { JsonObject } from "type-fest"
import { SideHandler, StaticPropsHandler } from "../types"

/**
 * Infer that Raw Page Props (i.e. with `{ $date: number }` not decoded)
 * https://blog.logrocket.com/understanding-infer-typescript/#:~:text=Using%20infer%20in%20TypeScript,to%20be%20referenced%20or%20returned.
 */
type InferRawPageProps<SH> = SH extends SideHandler<infer O>
  ? O
  : SH extends StaticPropsHandler<ParsedUrlQuery, infer O>
  ? O
  : never

/**
 * Infer the PageProps with dates decoded.
 */
export type InferPageProps<SH> = JsonToDateJson<InferRawPageProps<SH>>

type EmptyObject = {
  /* empty */
}

/**
 * Define the default export of a Page.
 *
 * IMPORTANT:
 * Converts JSON into DJ (JSON with dates). Dates are encoded as
 * `{ $date: number }` when `Web.getServerSideProps` is executed.
 *
 * - types the `props` argument using `typeof getServerSideProps` in generic
 * - ensures returned value is valid (React Element or null)
 */
export function Page<
  SH extends
    | SideHandler<JsonObject>
    | StaticPropsHandler<ParsedUrlQuery, JsonObject> = SideHandler<EmptyObject>
>(fn: NextPage<InferPageProps<SH>>) {
  const PageWithJsonProps: NextPage<InferRawPageProps<SH>> = function ({
    children,
    ...jsonProps
  }) {
    const djProps = DateJson.fromJsonValue(jsonProps)
    /**
     * I'm fairly confident this works but it has been challenging to get
     * the type issues to disappear.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return fn({ children, ...djProps })
  }

  return PageWithJsonProps
}

// export function page<SH extends SideHandler<JsonObject> = SideHandler<{}>>(
//   fn: NextPage<JsonToDateJson<InferPagePropsFromSideHandler<SH>>>
// ) {
//   const PageWithJsonProps: NextPage<InferPagePropsFromSideHandler<SH>> =
//     function ({ children, ...jsonProps }) {
//       const djProps = DateJson.fromJsonValue(jsonProps)
//       /**
//        * I'm fairly confident this works but it has been challenging to get
//        * the type issues to disappear.
//        */
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       return fn({ children, ...djProps })
//     }

//   return PageWithJsonProps
// }
