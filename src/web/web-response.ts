import { GetServerSidePropsResult } from "next"

export class WebResponse {
  value: GetServerSidePropsResult<unknown>

  constructor(value: GetServerSidePropsResult<unknown>) {
    this.value = value
  }
}

/**
 * Call it in `Web.getServerSideProps` to return a 404 Not Found
 */
export function notFound() {
  throw new WebResponse({ notFound: true })
}

/**
 * Call it in `Web.getServerSideProps` to redirect either temporary or
 * permanent.
 */
export function redirect(destination: string, permanent: boolean) {
  throw new WebResponse({ redirect: { destination, permanent } })
}
