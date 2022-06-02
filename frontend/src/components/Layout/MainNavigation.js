import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../store/auth";

const MainNavigation = (props) => {
  // get current authentication state from store
  const { isLoggedIn, profile } = useSelector((state) => state.auth);
  const isAdmin = isLoggedIn && profile.type === "admin";
  const isOperator = isLoggedIn && profile.type === "operator";

  const dispatch = useDispatch(); // dispatch actions to store

  const location = useLocation();
  const active = location.pathname;

  return (
    <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          EveryPass
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="ml-auto" activeKey={active}>
            {(isAdmin || isOperator) && (
              <Nav.Link
                as={Link}
                to="/passes-per-station"
                eventKey="/passes-per-station"
              >
                Διελεύσεις ανά Σταθμό
              </Nav.Link>
            )}
            {(isAdmin || isOperator) && (
              <Nav.Link
                as={Link}
                to="/passes-analysis"
                eventKey="/passes-analysis"
              >
                Ανάλυση Διελεύσεων
              </Nav.Link>
            )}
            {(isAdmin || isOperator) && (
              <Nav.Link as={Link} to="/passes-cost" eventKey="/passes-cost">
                Κόστος Διελεύσεων
              </Nav.Link>
            )}
            {(isAdmin || isOperator) && (
              <Nav.Link as={Link} to="/charges-by" eventKey="/charges-by">
                Χρεώσεις
              </Nav.Link>
            )}
            {(isAdmin || isOperator) && (
              <Nav.Link
                as={Link}
                to="/balance-analysis"
                eventKey="/balance-analysis"
              >
                Ανάλυση Οφειλών
              </Nav.Link>
            )}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/statistics" eventKey="/statistics">
                Στατιστικά
              </Nav.Link>
            )}
            {isLoggedIn && (
              <Nav.Link
                as={Button}
                variant="danger"
                onClick={() => dispatch(authActions.logout())}
              >
                Αποσύνδεση
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavigation;
