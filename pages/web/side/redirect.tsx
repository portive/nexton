import Web from "~/src/web"
import * as s from "superstruct"

export const getServerSideProps = Web.getServerSideProps(
  s.object({ count: s.optional(s.string()) }),
  async ({ count }) => {
    const nextCount = (count ? parseInt(count) : 0) + 1
    console.log({ nextCount })
    Web.redirect(`/web/side/redirect-dest?count=${nextCount}`, false)
    return {
      name: "John",
    }
  }
)

export default Web.Page<typeof getServerSideProps>(() => {
  return <p>Redirect destination (this text is never shown)</p>
})
