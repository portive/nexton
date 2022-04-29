import { InferGetServerSidePropsType } from "next"
import { Web } from "~/src/web"
import * as s from "superstruct"

export const getServerSideProps = Web.getServerSideProps(
  s.object({}),
  async () => {
    return {
      name: "John",
      at: new Date(),
    }
  }
)

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default Web.page<typeof getServerSideProps>((props) => {
  const { name, at } = props
  return (
    <p>
      Hello Again {name} {JSON.stringify(at)}
    </p>
  )
})
