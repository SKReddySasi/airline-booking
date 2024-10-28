import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

const Pagenotfound = () => {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ height: "calc(100vh - 130px)" }}
    >
      <Row className="text-center">
        <Col>
          <FaExclamationTriangle className="display-1 text-danger mb-4" />
          <p className="fs-3">
            <span className="text-danger">Oops!</span> Page not found.
          </p>
          <p className="lead">The page you’re looking for doesn’t exist.</p>
          <Link to="/search" className="btn btn-primary btn-lg">
            Go Home
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagenotfound;
