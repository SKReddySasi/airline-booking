import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFlights, resetSearchResults } from "../actions/flightActions";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { MdSentimentDissatisfied } from "react-icons/md";

const FlightSearch = () => {
  const [criteria, setCriteria] = useState({
    departure: "",
    arrival: "",
    date: "",
  });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [prevBookingCount, setPrevBookingCount] = useState(0);

  const dispatch = useDispatch();
  const flights = useSelector((state) => {
    return state.flights.searchResults;
  });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const bookings = useSelector((state) => state.bookings.bookings);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetSearchResults());
    }

    // Check for changes in the bookings
    const currentBookingCount = bookings.length;
    if (currentBookingCount !== prevBookingCount) {
      dispatch(resetSearchResults());
      setPrevBookingCount(currentBookingCount); // Update the previous booking count
    }
  }, [isAuthenticated, bookings, dispatch, prevBookingCount]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCriteria({ ...criteria, [name]: value });
  };

  const handleSearch = () => {
    dispatch(searchFlights(criteria));
    setSearchPerformed(true);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Search Flights</h1>
      <Form>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formDeparture">
              <Form.Label>Departure City</Form.Label>
              <Form.Control
                type="text"
                name="departure"
                placeholder="Enter Departure City"
                value={criteria.departure}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formArrival">
              <Form.Label>Arrival City</Form.Label>
              <Form.Control
                type="text"
                name="arrival"
                placeholder="Enter Arrival City"
                value={criteria.arrival}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formDate">
              <Form.Label>Departure Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={criteria.date}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {/* <Col md={1}>
           
          </Col> */}
        </Row>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      <Row className="mt-5">
        {flights && flights.length > 0
          ? flights.map((flight) => {
              const availableSeats = flight.availableSeats;
              const totalSeats = flight.totalSeats;
              const percentage = (availableSeats / totalSeats) * 100;

              return (
                <Col key={flight.id} md={6} className="mb-3">
                  <Link
                    to={`/flight/${flight.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card className="card-hover">
                      <Card.Header
                        className={`card-hover text-white text-center ${
                          flight.availableSeats === 0
                            ? "bg-secondary"
                            : "bg-primary"
                        }`}
                        // className="bg-primary text-white text-center"
                      >
                        <Card.Title>
                          Flight Number: {flight.flightNumber}
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <strong>Airline:</strong> {flight.airline}
                          <br />
                          <strong>Departure:</strong> {flight.departure}
                          <br />
                          <strong>Arrival:</strong> {flight.arrival}
                          <br />
                          <strong>Departure Date:</strong> {flight.date}
                          <br />
                          <strong>Price:</strong> ${flight.price}
                          <br />
                          <strong>Time:</strong> {flight.time}
                          <br />
                          <strong>Total Seats:</strong> {flight.totalSeats}
                          <br />
                          {/* <strong>Remaining seats percentage:</strong>{" "}
                          {percentage.toFixed(0)}% */}
                          {/* <br /> */}
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              className={`available-seats ${
                                percentage === 0
                                  ? "primary-bg" // red text for no seats
                                  : percentage >= 71
                                  ? "success-bg" // green text
                                  : percentage >= 41
                                  ? "amber-bg" // amber text
                                  : "warning-bg" // orange text
                              }`}
                            >
                              <strong>Available Seats:</strong>{" "}
                              {flight.availableSeats}
                            </span>
                            {percentage === 0 && (
                              <span className="d-flex align-items-center text-danger mt-2">
                                <MdSentimentDissatisfied className="me-2" />
                                <strong>Regret: No flights available.</strong>
                              </span>
                            )}
                          </Col>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })
          : searchPerformed && (
              <Col>
                <h2 className="text-center">No flights found.</h2>
              </Col>
            )}
      </Row>
    </Container>
  );
};

export default FlightSearch;
