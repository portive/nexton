import { Web } from "~/src/web"
import Link from "next/link"
import * as s from "superstruct"

export const getServerSideProps = Web.getServerSideProps(
  s.object({ count: s.optional(s.string()) }),
  async (query) => {
    return { count: query.count ? query.count : 1 }
  }
)

export default Web.page<typeof getServerSideProps>(({ count }) => {
  return (
    <p>
      Redirect destination count {count}{" "}
      <Link href={`/web/side/redirect?count=${count}`}>
        <a>Do it again</a>
      </Link>
    </p>
  )
})
