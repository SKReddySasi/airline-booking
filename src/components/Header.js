import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../actions/authActions";
import airAsiaLogo from "../assets/airasia_logo.png";
import { FaUser } from "react-icons/fa";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { resetSearchResults } from "../actions/flightActions";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAction = () => {
    if (user) {
      dispatch(logout());
      dispatch(resetSearchResults());
    } else {
      navigate("/");
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <button className="btn btn-primary" onClick={handleAction}>
          Sign Out
        </button>
      </Popover.Body>
    </Popover>
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container-fluid mx-5">
        <NavLink className="navbar-brand" to="/">
          <img
            src={airAsiaLogo}
            alt="AirAsia Logo"
            width={"80px"}
            className="d-inline-block align-text-top"
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/search">
                    Flights
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/manage"
                  >
                    Manage Booking
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/contact"
                  >
                    Contact Us
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center me-3">
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popover}
              >
                <div
                  style={{ cursor: "pointer" }}
                  className="d-flex align-items-center"
                >
                  <FaUser />
                  <span className="mx-1">{user.name}</span>
                </div>
              </OverlayTrigger>
            </div>
          )}
          {!user && (
            <button className="btn btn-primary" onClick={handleAction}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
