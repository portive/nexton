import { GetStaticProps } from "next"

export const getStaticProps: GetStaticProps = async (context) => {
  console.log("What is for dinner", context)
  return { props: { name: "John Doe" } }
}

export async function getStaticPaths() {
  return { paths: [{ params: {} }], fallback: false }
}

export default function Page({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello {name}</h1>
    </div>
  )
}
