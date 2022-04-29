import { Web } from "~/src/web"
import * as s from "superstruct"

export const getStaticProps = Web.getStaticProps(
  s.object({ name: s.string() }),
  async (params) => {
    return { name: params.name }
  }
)

export async function getStaticPaths() {
  return {
    paths: [
      { params: { name: "john" } },
      { params: { name: "jane" } },
      { params: { name: "david" } },
    ],
    fallback: true,
  }
}

export default Web.page<typeof getStaticProps>(({ name }) => {
  return <div>Hello {name}</div>
})
