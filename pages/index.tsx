import * as B from "react-bootstrap"
import { Card, ListGroup } from "react-bootstrap"
import Link from "next/link"

export default function Index() {
  return (
    <>
      <div>
        <h1
          style={{
            fontSize: 48,
            fontFamily: "Gill Sans, Gill Sans MT, Calibri, sans-serif",
            fontWeight: "600",
            color: "#3078b0",
          }}
        >
          NextDoor
        </h1>
        <p style={{ maxWidth: 640 }} className="mb-4">
          The following links are samples used during the development of
          NextDoor and examples we can use for testing to make sure that
          NextDoor works in the current Next.js environment.
        </p>
      </div>

      <B.Row>
        <B.Col>
          <Card className="mb-4">
            <Card.Header className="fw-bold">getServerSideProps</Card.Header>
            <ListGroup variant="flush">
              <Link href="/web/side/simple">
                <ListGroup.Item action>Date Support</ListGroup.Item>
              </Link>
              <Link href="/web/side/query/john">
                <ListGroup.Item action>Validate paths in Query </ListGroup.Item>
              </Link>
              <Link href="/web/side/not-found">
                <ListGroup.Item action>
                  <span className="text-muted">Web.</span>notFound
                </ListGroup.Item>
              </Link>
              <Link href="/web/side/redirect">
                <ListGroup.Item action>
                  <span className="text-muted">Web.</span>
                  redirect
                </ListGroup.Item>
              </Link>
            </ListGroup>
          </Card>
          <Card>
            <Card.Header className="fw-bold">
              getStaticProps &amp; getStaticPaths
            </Card.Header>
            <ListGroup variant="flush">
              <Link href="/web/static/simple/john">
                <ListGroup.Item action>Simple &quot;John&quot;</ListGroup.Item>
              </Link>
              <Link href="/web/static/simple/jane">
                <ListGroup.Item action>Simple &quot;Jane&quot;</ListGroup.Item>
              </Link>
              <Link href="/web/static/simple/fail">
                <ListGroup.Item action>Simple Fail - Not Found</ListGroup.Item>
              </Link>
            </ListGroup>
          </Card>
        </B.Col>
        <B.Col>
          <Card>
            <Card.Header className="fw-bold">API (Client/API)</Card.Header>
            <ListGroup variant="flush">
              <Link href="/web/api/simple">
                <ListGroup.Item action>Simple API Call</ListGroup.Item>
              </Link>
            </ListGroup>
          </Card>
        </B.Col>
        <B.Col>
          <Card>
            <Card.Header className="fw-bold">
              Next.js Native Examples
            </Card.Header>
            <ListGroup variant="flush">
              <Link href="/next/static/paths/jane">
                <ListGroup.Item action>Paths</ListGroup.Item>
              </Link>
            </ListGroup>
          </Card>
        </B.Col>
      </B.Row>
    </>
  )
}
