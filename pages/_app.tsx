import "bootstrap/dist/css/bootstrap.min.css"
import * as B from "react-bootstrap"
import { Navbar } from "react-bootstrap"
import Link from "next/link"
import { AppProps } from "next/app"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar bg="dark">
        <B.Container color="white">
          <Link href="/">
            <Navbar.Brand className="text-white" style={{ cursor: "pointer" }}>
              NextDoor <span className="text-muted">for Next.js</span>
            </Navbar.Brand>
          </Link>
        </B.Container>
      </Navbar>
      <B.Container className="pt-5">
        <Component {...pageProps} />
      </B.Container>
    </>
  )
}
