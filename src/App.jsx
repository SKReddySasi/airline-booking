import "./App.css";
import Header from "./components/Header";
import { Provider } from "react-redux";
import store from "./store";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import FlightSearch from "./components/FlightSearch";
import BookingForm from "./components/BookingForm";
import FlightDetails from "./components/FlightDetails";
import Pagenotfound from "./components/Pagenotfound";
import BookingConfirmation from "./components/BookingConfirmation";
import BookingManagement from "./components/BookingManagement";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";

// Fallback component to display when there's an error
const FallbackComponent = ({ error }) => {
  return <div>Something went wrong: {error.message}</div>;
};

const AppLayout = () => {
  return (
    <Provider store={store}>
      <Header />
      <Outlet />
    </Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/search",
        element: <FlightSearch />,
      },
      {
        path: "/flight/:id",
        element: <FlightDetails />,
      },
      {
        path: "/book/:flightId",
        element: <BookingForm />,
      },
      {
        path: "/confirmation",
        element: <BookingConfirmation />,
      },
      {
        path: "/manage",
        element: <BookingManagement />,
      },
      {
        path: "*",
        element: <Pagenotfound />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <RouterProvider router={router} />
        <ToastContainer />
      </ErrorBoundary>
    </>
  );
}

export default App;
