import { GetStaticPropsContext } from "next"

export const getStaticProps = async (
  context: GetStaticPropsContext<{ name: string }>
) => {
  const { params } = context
  if (params === undefined) throw new Error(`Expected params to be defined`)

  return { props: { name: params.name } }
}

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

export default function Page({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello {name}</h1>
    </div>
  )
}
