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
    <>
      <p>Hello Again {name}</p>
      <p>
        Value of <code>&quot;at&quot;</code> stringified: {JSON.stringify(at)}
      </p>
      <p>
        {at instanceof Date ? (
          <span className="text-success">Success! It&apos;s a Date!</span>
        ) : (
          <span className="text-danger">Failed! Not a Date.</span>
        )}
      </p>
    </>
  )
})
