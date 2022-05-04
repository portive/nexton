import Web from "~/src/web"
import * as s from "superstruct"

export const getServerSideProps = Web.getServerSideProps(
  s.object({}),
  async () => {
    Web.notFound()
    return {
      name: "John",
    }
  }
)

export default Web.Page<typeof getServerSideProps>((props) => {
  const { name } = props
  return <p>Hello Again {name}</p>
})
