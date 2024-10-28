import {
  BOOK_FLIGHT,
  CANCEL_BOOKING,
  UPDATE_BOOKING_TRAVELERS,
} from "../actions/bookingActions";

const initialState = { bookings: [] };

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_FLIGHT:
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };

    case CANCEL_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.payload
        ),
      };

    case UPDATE_BOOKING_TRAVELERS:
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.bookingId
            ? {
                ...booking,
                travelers: action.payload.updatedTravelers,
                seatsBooked: action.payload.newSeatsBooked,
                totalPrice: action.payload.newTotalPrice,
              }
            : booking
        ),
      };

    default:
      return state;
  }
};

export default bookingReducer;
