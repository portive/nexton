import Web, { s } from "~/src/web"

export const getServerSideProps = Web.getServerSideProps(
  s.object({}),
  async () => {
    return {
      name: "John",
      at: new Date(),
    }
  }
)

export type PageProps = Web.InferPageProps<typeof getServerSideProps>

export default Web.Page<typeof getServerSideProps>((props: PageProps) => {
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
