import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { bookFlight } from "../actions/bookingActions";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { fetchFlights } from "../actions/flightActions";

const BookingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flightId } = useParams();

  const selectedFlight = useSelector((state) => {
    return state.flights.searchResults.find((flight) => flight.id === flightId);
  });

  const [seatsBooked, setSeatsBooked] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([]);

  useEffect(() => {
    if (selectedFlight) {
      // Initialize traveler details based on the number of seats booked
      const initialDetails = Array.from({ length: seatsBooked }, () => ({
        firstName: "",
        lastName: "",
        gender: "",
      }));
      setTravelerDetails(initialDetails);
    }
  }, [seatsBooked, selectedFlight]);

  const handleTravelerChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = [...travelerDetails];
    updatedDetails[index][name] = value;
    setTravelerDetails(updatedDetails);
  };

  const handleAddTraveler = () => {
    // Check if available seats are exceeded
    if (travelerDetails.length < selectedFlight.availableSeats) {
      setTravelerDetails((prevDetails) => [
        ...prevDetails,
        { firstName: "", lastName: "", gender: "" },
      ]);
      setSeatsBooked((prev) => prev + 1);
    } else {
      toast.error(
        `Cannot book more seats than available. Available seats: ${selectedFlight.availableSeats}`
      );
    }
  };

  const handleRemoveTraveler = (index) => {
    const updatedDetails = travelerDetails.filter((_, i) => i !== index);
    setTravelerDetails(updatedDetails);
    setSeatsBooked(updatedDetails.length); // Update the seats booked count
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const bookingDetails = {
      ...selectedFlight,
      flightId: selectedFlight.id,
      seatsBooked,
      totalPrice: selectedFlight.price * seatsBooked,
      travelers: travelerDetails,
    };
    dispatch(bookFlight(bookingDetails));
    dispatch(fetchFlights);
    navigate("/confirmation");
  };

  if (!selectedFlight) {
    return <div>Loading flight details...</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h2>
            {selectedFlight.flightNumber} - {selectedFlight.airline}
          </h2>
          <Row>
            <Col md={4}>
              <h6>
                <MdFlightTakeoff style={{ marginRight: "5px" }} />
                {selectedFlight.departure}
                <FaArrowRight style={{ margin: "0 10px" }} />
                <MdFlightLand style={{ marginLeft: "5px" }} />
                {selectedFlight.arrival}
              </h6>
              <h6>Available Seats: {selectedFlight.availableSeats}</h6>
            </Col>
            <Col md={4}>
              <h6>Date: {selectedFlight.date}</h6>
              <h6>Time: {selectedFlight.time}</h6>
            </Col>
            <Col md={4}>
              <h6>Price: ${selectedFlight.price.toFixed(2)}</h6>
              <h6>Duration: {selectedFlight.duration}</h6>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleBooking}>
            {travelerDetails.map((traveler, index) => (
              <div
                key={index}
                className="mb-3 border p-3 rounded position-relative"
              >
                <div className="travelerAlignment">
                  <h5>Traveler {index + 1}</h5>
                  <Button
                    variant="link"
                    onClick={() => handleRemoveTraveler(index)}
                    style={{ padding: 0 }}
                  >
                    <FaTimes style={{ color: "red" }} />
                  </Button>
                </div>
                <Row>
                  <Col>
                    <Form.Group controlId={`firstName${index}`}>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={traveler.firstName}
                        onChange={(e) => handleTravelerChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`lastName${index}`}>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={traveler.lastName}
                        onChange={(e) => handleTravelerChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`gender${index}`}>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={traveler.gender}
                        onChange={(e) => handleTravelerChange(index, e)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={handleAddTraveler}>
                Add Another Traveler
              </Button>

              <Button variant="primary" type="submit">
                Confirm Booking
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingForm;
