import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import { FaPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  cancelBooking,
  updateBookingTravelers,
} from "../actions/bookingActions";
import axios from "axios";

const BookingManagement = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;

  const bookings = useSelector((state) =>
    state.bookings.bookings.filter((booking) => booking.userId === userId)
  );

  const handleCancelBooking = async (bookingId) => {
    const bookingToCancel = bookings.find(
      (booking) => booking.id === bookingId
    );

    // Update available seats
    const availableSeatsResponse = await axios.get(
      `http://localhost:9000/flights/${bookingToCancel.flightId}`
    );

    const availableSeats = availableSeatsResponse.data.availableSeats;
    const updatedAvailableSeats = availableSeats + bookingToCancel.seatsBooked; // Add back the booked seats

    await axios.put(
      `http://localhost:9000/flights/${bookingToCancel.flightId}`,
      {
        ...bookingToCancel,
        availableSeats: updatedAvailableSeats,
      }
    );

    dispatch(cancelBooking(bookingId));
  };

  const handleRemoveTraveler = async (bookingId, travelerIndex) => {
    const updatedBooking = bookings.find((booking) => booking.id === bookingId);
    const updatedTravelers = updatedBooking.travelers.filter(
      (_, index) => index !== travelerIndex
    );

    // Update available seats
    const availableSeatsResponse = await axios.get(
      `http://localhost:9000/flights/${updatedBooking.flightId}`
    );

    const availableSeats = availableSeatsResponse.data.availableSeats;
    const updatedAvailableSeats = availableSeats + 1; // Increment the available seats by 1

    await axios.put(
      `http://localhost:9000/flights/${updatedBooking.flightId}`,
      {
        ...updatedBooking,
        availableSeats: updatedAvailableSeats,
      }
    );

    dispatch(updateBookingTravelers(bookingId, updatedTravelers));
  };

  return (
    <Container className="mt-5">
      {bookings.length === 0 ? (
        <div className="text-center text-center">
          <h3>No bookings found.</h3>
          <p>
            It looks like you haven't made any bookings yet. Would you like to
            book a flight?
          </p>
          <Link to="/search">
            <Button variant="primary">
              <FaPlane className="me-2" /> Go to Flights
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="mb-3"
              style={{ backgroundColor: "#e6ffed", borderColor: "#d4edda" }}
            >
              <Card.Header className="bg-success text-white">
                <h5>Booking ID: {booking.id}</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p>
                      <strong>Departure :</strong> {booking.departure}
                    </p>
                    <p>
                      <strong>Flight ID:</strong> {booking.flightId}
                    </p>
                    <p>
                      <strong>Seats Booked:</strong> {booking.seatsBooked}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>Arrival:</strong> {booking.arrival}
                    </p>
                    <p>
                      <strong>Date:</strong> {booking.date}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ${" "}
                      {booking.totalPrice.toFixed(2)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <strong>Time:</strong> {booking.time}
                    </p>
                    <p>
                      <strong>Duration:</strong> {booking.duration}
                    </p>

                    <p>
                      <strong>Baggage Allowance:</strong>{" "}
                      {booking.baggageAllowance}
                    </p>
                  </Col>
                </Row>
                <h6>Traveler Details:</h6>
                <Row>
                  <Col md={8}>
                    <ul>
                      {booking.travelers.map((traveler, index) => (
                        <li key={index}>
                          {traveler.firstName} {traveler.lastName} -{" "}
                          {traveler.gender}
                          <Button
                            variant="link"
                            className="text-danger ms-2"
                            onClick={() =>
                              handleRemoveTraveler(booking.id, index)
                            }
                          >
                            Remove Traveler
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button
                      variant="danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default BookingManagement;
