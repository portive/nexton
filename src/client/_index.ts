import { JsonToDateJson, fromJsonValue } from "ejson-date"
import { JsonObject } from "type-fest"
import { APIHandler } from "../types"
import { handleErrorResponse } from "./handle-error"

type InferProps<H extends APIHandler<JsonObject, JsonObject>> =
  H extends APIHandler<infer P, JsonObject> ? P : never

type InferResponse<H extends APIHandler<JsonObject, JsonObject>> =
  H extends APIHandler<JsonObject, infer R> ? R : never

export async function call<H extends APIHandler<JsonObject, JsonObject>>(
  url: string,
  props: InferProps<H>
) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(props),
    headers: { "Content-Type": "application/json" },
  })
  if (res.ok) {
    try {
      /**
       * If the fetch is successful, return the data as JSON.
       */
      const json = await res.json()
      const dateJson = fromJsonValue(json)
      return dateJson as JsonToDateJson<InferResponse<H>>
    } catch (e) {
      // API call from Client returned non-JSON type. Should show in debug.
      throw new Error(
        `Client call expects JSON response but API response was something else instead like text`
      )
    }
  } else {
    handleErrorResponse({ url, props })
    const text = await res.text()
    const htmlErrorTitleMatch = text.match(/<title>(.*)<\/title>/)
    const errorTitle = htmlErrorTitleMatch ? htmlErrorTitleMatch[1] : null
    if (errorTitle) {
      /**
       * If we can extract the title from the text which is, presumably HTML,
       * then throw an error with just the title.
       *
       * NOTE: We keep the following comment as `//` so that it displays
       * in the source code listing in the browser because it is very
       * close to the `throw new Error` code.
       */
      // Response not `ok` like 404 or 403 response. Should show in debug.
      throw new Error(errorTitle)
    } else {
      /**
       * If we can't find the title, for the time being, just dump everything
       * but if it is HTML, it is going to look really messy because we will
       * be seeing unparsed HTML code.
       */
      throw new Error(text)
    }
  }
}

const _call = call

export function create(baseUrl: string) {
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    throw new Error(`baseUrl must start with http:// or https://`)
  }
  if (baseUrl.endsWith("/")) {
    throw new Error(`baseUrl must not end in /`)
  }

  async function call<H extends APIHandler<JsonObject, JsonObject>>(
    subpath: string,
    props: InferProps<H>
  ) {
    const url = `${baseUrl}/${subpath}`
    return await _call(url, props)
  }

  return { call }
}
