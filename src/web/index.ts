import { getServerSideProps } from "./get-server-side-props"
import { page } from "./page"
import { notFound, redirect } from "./web-response"

export const Web = {
  notFound,
  redirect,
  getServerSideProps,
  page,
}
