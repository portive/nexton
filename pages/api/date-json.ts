import API from "~/src/api"
import * as s from "superstruct"

const Props = s.object({ name: s.string() })

const handler = API.handler(Props, async (props) => {
  const at = new Date()
  return {
    at,
    name: props.name,
  }
})

export default handler
