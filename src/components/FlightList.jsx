import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFlight } from "../actions/flightActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FlightList = () => {
  const { flights, loading, error } = useSelector((state) => state.flights);
  const dispatch = useDispatch();

  if (loading) return <div>Loading...</div>;

  if (error) {
    toast.error(`Error: ${error}`);
    return null;
  }

  return (
    <div>
      <h2>Available Flights</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            <Link
              to={`/flight/${flight.id}`}
              onClick={() => dispatch(selectFlight(flight))}
            >
              {flight.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;
