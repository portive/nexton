import API, { s } from "~/src/api"

const Props = s.object({ name: s.string() })

const handler = API.handler(Props, async (props) => {
  const at = new Date()
  return {
    at,
    name: props.name,
  }
})

export default handler
