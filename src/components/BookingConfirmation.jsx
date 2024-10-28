import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const BookingConfirmation = () => {
  const bookings = useSelector((state) => state.bookings.bookings);
  const booking = bookings.slice(-1)[0]; // Get the most recent booking

  return (
    <Container
      className="mt-2 d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 130px)" }}
    >
      <Row className="w-100">
        {booking ? (
          <Col md={8} lg={6} className="mx-auto">
            <Card
              className="text-center"
              style={{ backgroundColor: "#e6ffed", borderColor: "#d4edda" }}
            >
              <Card.Header className="bg-success text-white">
                <h5>
                  <FaCheckCircle /> Booking Confirmed!
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Departure:</strong> {booking.departure}
                    </p>
                    <p>
                      <strong>Arrival:</strong> {booking.arrival}
                    </p>
                    <p>
                      <strong>Flight ID:</strong> {booking.flightId}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Booking ID:</strong> {booking.id}
                    </p>
                    <p>
                      <strong>Total Price:</strong> $
                      {booking.totalPrice.toFixed(2)}
                    </p>
                    <p>
                      <strong>Seats Booked:</strong> {booking.seatsBooked}
                    </p>
                  </Col>
                </Row>
                <h5>
                  <strong>Traveler Details :</strong>
                </h5>
                <Row>
                  {booking.travelers.map((traveler, index) => (
                    <Col key={index} className="mb-2">
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            {traveler.firstName} {traveler.lastName}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Gender: {traveler.gender}
                          </Card.Subtitle>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Col md={6} className="text-between">
                    <Link to="/search">
                      <Button variant="secondary">Back to Search</Button>
                    </Link>
                  </Col>
                  <Col md={6} className="text-between">
                    <Link to="/manage">
                      <Button variant="primary">Manage Bookings</Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col md={12} className="text-center">
            <Card>
              <Card.Body>
                <p>No booking found.</p>
                <Link to="/search">
                  <Button variant="secondary">Back to Search</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BookingConfirmation;
