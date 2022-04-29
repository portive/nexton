import { InferGetServerSidePropsType } from "next"
import { Web } from "~/src/web"

export const getServerSideProps = Web.getServerSideProps(async () => {
  return {
    name: "John",
    at: new Date(),
  }
})

export type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default Web.page<typeof getServerSideProps>((props) => {
  const { name, at } = props
  return (
    <p>
      Hello Again {name} {JSON.stringify(at)}
    </p>
  )
})
