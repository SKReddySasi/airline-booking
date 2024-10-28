import {
  SEARCH_FLIGHTS_REQUEST,
  SEARCH_FLIGHTS_SUCCESS,
  SEARCH_FLIGHTS_FAILURE,
  RESET_SEARCH_RESULTS,
} from "../actions/flightActions";

// Initial state for the flight reducer
const initialState = {
  flights: [],
  searchResults: [],
  loading: false,
  error: null,
};

const flightReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_FLIGHTS_REQUEST:
      return { ...state, loading: true, error: null };

    case SEARCH_FLIGHTS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null,
      };

    case SEARCH_FLIGHTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case RESET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: [],
      };

    default:
      return state;
  }
};

export default flightReducer;
