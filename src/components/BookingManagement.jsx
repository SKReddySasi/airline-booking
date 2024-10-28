import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Container,
  Card,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { FaPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  cancelBooking,
  UPDATE_BOOKING_TRAVELERS,
  updateBookingTravelers,
} from "../actions/bookingActions";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [currentTraveler, setCurrentTraveler] = useState({});
  const [updatedTraveler, setUpdatedTraveler] = useState({});

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

    const availableSeatss = availableSeatsResponse.data.availableSeats;
    const updatedAvailableSeats = availableSeatss + bookingToCancel.seatsBooked; // Add back the booked seats

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

    // Check if there will be at least one traveler left
    if (updatedTravelers.length === 0) {
      // if user want to cancel the entire booking
      const confirmCancel = window.confirm(
        "At least one traveler must remain. Would you like to cancel the entire booking instead?"
      );

      if (confirmCancel) {
        await handleCancelBooking(bookingId);
        return;
      } else {
        return;
      }
    }

    // Calculate new seats booked
    const newSeatsBooked = updatedTravelers.length;

    // Calculate new total price
    const pricePerSeat = updatedBooking.totalPrice / updatedBooking.seatsBooked;
    const newTotalPrice = pricePerSeat * newSeatsBooked;

    // Update available seats
    const availableSeatsResponse = await axios.get(
      `http://localhost:9000/flights/${updatedBooking.flightId}`
    );

    const availableSeatss = availableSeatsResponse.data.availableSeats;
    const updatedAvailableSeats = availableSeatss + 1; // Increment the available seats by 1

    await axios.put(
      `http://localhost:9000/flights/${updatedBooking.flightId}`,
      {
        ...updatedBooking,
        availableSeats: updatedAvailableSeats
      }
    );

    // Dispatch updated travelers and booking details
    await dispatch(updateBookingTravelers(bookingId, updatedTravelers));

    // Update the booking with new seats booked and total price
    if (newTotalPrice >= 0) {
      dispatch({
        type: UPDATE_BOOKING_TRAVELERS,
        payload: {
          bookingId,
          updatedTravelers,
          newSeatsBooked,
          newTotalPrice,
        },
      });
    } else {
      console.error("Calculated total price is invalid:", newTotalPrice);
    }
  };

  const handleEditTraveler = (traveler, bookingId) => {
    setCurrentTraveler(traveler);
    setUpdatedTraveler(traveler);
    setCurrentBookingId(bookingId);
    setShowEditModal(true);
  };

  const handleSaveTraveler = async () => {
    const updatedBooking = bookings.find(
      (booking) => booking.id === currentBookingId
    );

    // Update travelers
    const updatedTravelers = updatedBooking.travelers.map((traveler) =>
      traveler === currentTraveler ? updatedTraveler : traveler
    );

    // Calculate new total price and seats booked
    const newSeatsBooked = updatedTravelers.length;
    const pricePerSeat = updatedBooking.totalPrice / updatedBooking.seatsBooked;
    const newTotalPrice = pricePerSeat * newSeatsBooked;

    // Dispatch updated travelers and booking details
    await dispatch(updateBookingTravelers(currentBookingId, updatedTravelers));

    // Update booking with new seats booked and total price
    dispatch({
      type: UPDATE_BOOKING_TRAVELERS,
      payload: {
        bookingId: currentBookingId,
        updatedTravelers,
        newSeatsBooked,
        newTotalPrice,
      },
    });

    setShowEditModal(false);
  };

  const filteredBookings = searchTerm
    ? bookings.filter((booking) => booking.id.includes(searchTerm))
    : bookings;

  return (
    <Container className="mt-5">
      {bookings.length === 0 ? (
        // No bookings case
        <div className="text-center">
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
        <>
          {/* Show search input only if there are bookings */}
          <Form className="mb-4">
            <Form.Group controlId="searchPNR">
              <Form.Label>Search by PNR Number:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter PNR Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>

          {filteredBookings.length === 0 ? (
            // No PNR matched case
            <div className="text-center">
              <FaExclamationTriangle
                className="mb-2"
                size={48}
                color="orange"
              />
              <h3>No PNR matched with the search.</h3>
              <p>Please check the PNR number and try again.</p>
            </div>
          ) : (
            // Display bookings
            <div>
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="mb-3"
                  style={{ backgroundColor: "#e6ffed", borderColor: "#d4edda" }}
                >
                  <Card.Header className="bg-success text-white">
                    <h5>PNR ID: {booking.id}</h5>
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
                          {booking.totalPrice
                            ? booking.totalPrice.toFixed(2)
                            : "0.00"}
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
                                className="ms-2"
                                onClick={() =>
                                  handleEditTraveler(traveler, booking.id)
                                }
                              >
                                Edit
                              </Button>
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
        </>
      )}

      {/* Edit Traveler Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Traveler</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="travelerFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedTraveler.firstName || ""}
                onChange={(e) =>
                  setUpdatedTraveler({
                    ...updatedTraveler,
                    firstName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="travelerLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedTraveler.lastName || ""}
                onChange={(e) =>
                  setUpdatedTraveler({
                    ...updatedTraveler,
                    lastName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="travelerGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={updatedTraveler.gender || ""}
                onChange={(e) =>
                  setUpdatedTraveler({
                    ...updatedTraveler,
                    gender: e.target.value,
                  })
                }
              >
                {/* <option value="">Select Gender</option> */}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveTraveler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingManagement;
