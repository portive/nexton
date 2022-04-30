import { Web } from "~/src/web"
import { Client } from "~/src/client"
import { useEffect, useState } from "react"
import Handler from "~/pages/api/date-json"

export default Web.page(() => {
  const [name, setName] = useState<string>()
  const [at, setAt] = useState<Date>()

  useEffect(() => {
    const fn = async () => {
      const response = await Client.call<typeof Handler>("/api/date-json", {
        name: "John Doe",
      })
      setName(response.name)
      setAt(response.at)
    }
    fn()
  }, [])

  return (
    <>
      <h1>Call API from Browser</h1>
      <p>{name}</p>
      <p>Type should be Date: {at instanceof Date ? "Date" : "unknown"}</p>
      <p>{`${at}`}</p>
    </>
  )
})
