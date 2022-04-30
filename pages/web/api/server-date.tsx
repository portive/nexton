import { Web } from "~/src/web"
import { Client } from "~/src/client"
import * as s from "superstruct"
import Handler from "~/pages/api/date-json"

const Query = s.object({})

export const getServerSideProps = Web.getServerSideProps(Query, async () => {
  const response = await Client.call<typeof Handler>(
    "http://localhost:3404/api/date-json",
    {
      name: "John Doe",
    }
  )
  return { name: response.name, at: response.at }
})

export default Web.page<typeof getServerSideProps>(({ name, at }) => {
  return (
    <>
      <h1>Call API from Server</h1>
      <p>{name}</p>
      <p>Type should be Date: {at instanceof Date ? "Date" : "unknown"}</p>
      <p>{`${at}`}</p>
    </>
  )
})
