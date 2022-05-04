import { InferGetServerSidePropsType } from "next"
import Web from "~/src/web"
import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"

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

export default Web.Page<typeof getServerSideProps>((props) => {
  const { id, name, at } = props
  AssertType.Equal<typeof id, string>(true)
  AssertType.Equal<typeof name, string>(true)
  AssertType.Equal<typeof at, Date>(true)
  return (
    <p>
      Hello Again {name} {JSON.stringify(at)}: id {id}
    </p>
  )
})
