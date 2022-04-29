import { Web } from "~/src/web"
import * as s from "superstruct"

export const getStaticProps = Web.getStaticProps(
  s.object({ name: s.string() }),
  async (params) => {
    return { name: params.name }
  }
)

export const getStaticPaths = Web.getStaticPaths<typeof getStaticProps>(
  async () => {
    return {
      paths: [
        { params: { name: "john", age: 25 } },
        // { params: { name: "jane" } },
        // { params: { name: "david" } },
      ],
      fallback: true,
    }
  }
)

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { name: "john" } },
//       { params: { name: "jane" } },
//       { params: { name: "david" } },
//     ],
//     fallback: true,
//   }
// }

export default Web.page<typeof getStaticProps>(({ name }) => {
  return <div>Hello {name}</div>
})
