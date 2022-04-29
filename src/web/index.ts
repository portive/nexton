import { NextPage } from "next"
import { JsonObject } from "type-fest"
import { SideHandler } from "../types"
import { getServerSideProps } from "./get-server-side-props"
export * from "./get-server-side-props"

/**
 * Remember the Generic is provided so we can't make it simpler. We have to
 * infer from it.
 */
function page<H extends SideHandler<JsonObject>>(
  nextPage: NextPage<Awaited<ReturnType<H>>>
) {
  return nextPage
}

export const Web = {
  getServerSideProps,
  page,
}
