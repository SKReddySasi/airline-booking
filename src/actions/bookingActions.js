import axios from "axios";
import { toast } from "react-toastify";

export const BOOK_FLIGHT = "BOOK_FLIGHT";
export const CANCEL_BOOKING = "CANCEL_BOOKING";
export const BOOKING_ERROR = "BOOKING_ERROR";
export const UPDATE_BOOKING_TRAVELERS = "UPDATE_BOOKING_TRAVELERS";

// Action to book a flight
export const bookFlight = (bookingDetails) => async (dispatch, getState) => {
  try {
    const { auth } = getState(); // Get the auth state to retrieve the user ID
    const userId = auth.user.id;

    // Send a POST request to create a new booking
    const response = await axios.post("http://localhost:9000/bookings", {
      ...bookingDetails,
      userId, // Include the user ID
    });

    // Calculate available seats
    const availableSeatsResponse = await axios.get(
      `http://localhost:9000/flights/${bookingDetails.flightId}`
    );
    let availableSeats =
      availableSeatsResponse.data.availableSeats - bookingDetails.seatsBooked;

    // Update available seats for the flight
    await axios.put(
      `http://localhost:9000/flights/${bookingDetails.flightId}`,
      {
        ...bookingDetails,
        availableSeats,
      }
    );

    dispatch({ type: BOOK_FLIGHT, payload: response.data });
    toast.success("Flight booked successfully!");
  } catch (error) {
    dispatch({
      type: BOOKING_ERROR,
      payload: "Booking failed. Please try again.",
    });
    toast.error("Booking failed. Please try again.");
  }
};

// Action to cancel a booking
export const cancelBooking = (bookingId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:9000/bookings/${bookingId}`);

    dispatch({ type: CANCEL_BOOKING, payload: bookingId });
    toast.success("Booking canceled successfully.");
  } catch (error) {
    dispatch({
      type: BOOKING_ERROR,
      payload: "Cancellation failed. Please try again.",
    });
    toast.error("Cancellation failed. Please try again.");
  }
};

// Action to update travelers in a booking
export const updateBookingTravelers =
  (bookingId, updatedTravelers) => async (dispatch) => {
    try {
      await axios.put(`http://localhost:9000/bookings/${bookingId}`, {
        travelers: updatedTravelers,
      });

      dispatch({
        type: UPDATE_BOOKING_TRAVELERS,
        payload: { bookingId, updatedTravelers },
      });

      toast.success("Traveler removed successfully.");
    } catch (error) {
      dispatch({
        type: BOOKING_ERROR,
        payload: "Failed to remove traveler. Please try again.",
      });
      toast.error("Failed to remove traveler. Please try again.");
    }
  };
