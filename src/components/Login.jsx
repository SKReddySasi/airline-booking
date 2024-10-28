import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../actions/authActions";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import airAsiaZoneUp from "../assets/airasia_zoneup.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get("http://localhost:9000/users");
      const users = response.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        dispatch(login(user));
        navigate("/search");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error", error);
      setError("An error occurred while logging in.");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              {/* <h2 className="text-center mb-4">Login</h2> */}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && (
                  <Alert className="mt-3" variant="danger">
                    {error}
                  </Alert>
                )}
                <Button variant="primary" type="submit" className="mt-3">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <img
            src={airAsiaZoneUp}
            alt="AirAsia Promotions"
            className="img-fluid"
          />
        </Col>
      </Row>

      <div className="mt-5">
        <h4 className="text-center mb-4">
          <strong>AirAsia Promotions 2024 in India</strong>
        </h4>
        <Card className="mb-3">
          <Card.Body>
            <p>
              AirAsia Promotions 2024 offers you a big list of products and
              services that include flights and hotels. This is one of the best
              travel and lifestyle online platforms that provides an amazing
              shopping experience on AirAsia's official website or mobile app.
            </p>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <p>
              The AirAsia promotion page on the AirAsia website and super app is
              filled with some of the best discounts, promotions for AirAsia
              vouchers, and coupon codes that get you the best deals at the
              cheapest prices for flight tickets. Keep a lookout for the
              much-anticipated AirAsia sales, and you can easily grab free seats
              on AirAsia flights. Fly from New Delhi or any city in Southeast
              Asia to the rest of the world at fantastic airfares that you won’t
              find anywhere else!
            </p>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <p>
              As an Online Travel Agency (OTA), AirAsia.com offers an amazing
              selection of flight deals with over 700 international and domestic
              airlines, in addition to flights operated by AirAsia that serve
              literally every corner of the world. With regular sales and
              AirAsia promo codes, now’s the time to take advantage of these
              deals to book cheap airline tickets. The AirAsia cheap flights
              have made it possible for everyone to travel and see the world
              without busting their budgets.
            </p>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <p>
              The AirAsia booking ticket promo section on the website and super
              app will get you the best deals on flights and other products and
              services. Complete your shopping experience with AirAsia promo
              codes and discounts on hotel rooms and even e-hailing rides from
              the airport to your final destination in the city. Everything at
              reduced prices that will put a smile on your face.
            </p>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <p>
              These exclusive deals on AirAsia Promotions 2024 are not available
              anywhere else. Sign up now as an AirAsia Rewards member to get
              dibs on all the specials that will also earn you AirAsia Points.
              You can use these reward points to redeem flights and other
              products or services available on the AirAsia website.
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
