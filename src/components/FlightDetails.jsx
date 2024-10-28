import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Card, Row, Col, ListGroup, Button } from "react-bootstrap";
// import { TbRotate3D } from "react-icons/tb";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const flight = useSelector((state) => {
    const foundFlight = state.flights.searchResults.find(
      (flight) => flight.id === id
    );
    return foundFlight;
  });

  if (!flight) {
    return <div className="text-center mt-4">Flight not found.</div>;
  }

  const availableSeats = flight.availableSeats;
  const totalSeats = flight.totalSeats;
  const percentage = (availableSeats / totalSeats) * 100;

  const handleBookFlight = () => {
    navigate(`/book/${flight.id}`);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">{flight.flightNumber}</h2>
      <Card>
        <Card.Header className="bg-primary text-white text-center">
          <h5>Flight Information</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Departure:</strong> {flight.departure}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Arrival:</strong> {flight.arrival}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Departure Date:</strong> {flight.date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Time:</strong> {flight.time}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price:</strong> ${flight.price}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Available Seats:</strong> {flight.availableSeats}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Airline:</strong> {flight.airline}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Duration:</strong> {flight.duration}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Layovers:</strong> {flight.layovers}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Flight Type:</strong> {flight.flightType}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={8}>
              <h5>
                <strong>Baggage Allowance:</strong> {flight.baggageAllowance}
              </h5>
              <h5>
                <strong>In-Flight Services:</strong>{" "}
                {flight.inFlightServices.join(", ")}
              </h5>
            </Col>
            <Col md={4} className="text-end">
              <Button
                disabled={percentage === 0}
                className="mt-4"
                variant={flight.availableSeats > 0 ? "primary" : ""}
                onClick={handleBookFlight}
              >
                Book Flight
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FlightDetails;
