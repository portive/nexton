import { InferGetServerSidePropsType } from "next"
import { Web } from "~/src/web"
import * as s from "superstruct"

const Query = s.object({
  id: s.string(),
})

export const getServerSideProps = Web.getServerSideProps(
  Query,
  async (query) => {
    const { id } = query
    return {
      id,
      name: "John",
      at: new Date(),
    }
  }
)

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default Web.page<typeof getServerSideProps>((props) => {
  const { id, name, at } = props
  return (
    <p>
      Hello Again {name} {JSON.stringify(at)}: id {id}
    </p>
  )
})
