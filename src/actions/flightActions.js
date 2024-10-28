import axios from "axios";

// Action Types
export const SEARCH_FLIGHTS_REQUEST = "SEARCH_FLIGHTS_REQUEST";
export const SEARCH_FLIGHTS_SUCCESS = "SEARCH_FLIGHTS_SUCCESS";
export const SEARCH_FLIGHTS_FAILURE = "SEARCH_FLIGHTS_FAILURE";
export const RESET_SEARCH_RESULTS = "RESET_SEARCH_RESULTS";
export const SELECT_FLIGHT = "SELECT_FLIGHT";

// Base URL for API requests
const BASE_URL = "http://localhost:9000/flights";

// Action to search for flights
export const searchFlights = (criteria) => async (dispatch) => {
  dispatch({ type: SEARCH_FLIGHTS_REQUEST });
  try {
    const response = await axios.get(BASE_URL);
    const flights = response.data;

    // Filter the flights based on the criteria
    const filteredFlights = flights.filter(
      (flight) =>
        flight.departure.toLowerCase() === criteria.departure.toLowerCase() &&
        flight.arrival.toLowerCase() === criteria.arrival.toLowerCase() &&
        flight.date === criteria.date
    );

    dispatch({ type: SEARCH_FLIGHTS_SUCCESS, payload: filteredFlights });
  } catch (error) {
    dispatch({ type: SEARCH_FLIGHTS_FAILURE, payload: error.message });
  }
};

// Action to fetch all flights
export const fetchFlights = () => async (dispatch) => {
  dispatch({ type: SEARCH_FLIGHTS_REQUEST });
  try {
    const response = await axios.get(BASE_URL);
    const flights = response.data;

    dispatch({ type: SEARCH_FLIGHTS_SUCCESS, payload: flights });
  } catch (error) {
    dispatch({ type: SEARCH_FLIGHTS_FAILURE, payload: error.message });
  }
};

// Action to reset serach results
export const resetSearchResults = () => ({
  type: RESET_SEARCH_RESULTS,
});

// Action to select a flight
export const selectFlight = (flight) => ({
  type: SELECT_FLIGHT,
  payload: flight,
});
