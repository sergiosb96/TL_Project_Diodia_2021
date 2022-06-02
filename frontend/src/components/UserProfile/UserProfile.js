import React, { Fragment } from "react";
import { Alert, Card, ListGroup } from "react-bootstrap";

import { formatDateTimeString } from "../../libs/string-manipulation";

// Display logged in user's profile info
const UserProfile = (props) => {
  const user = props.user;
  const expirationTime = formatDateTimeString(props.expirationTime);

  // if user's data from props is not set or invalid, display message
  if (!user) {
    return (
      <Fragment>
        <Alert variant="danger">Δε βρέθηκαν στοιχεία για τον χρήστη.</Alert>
        <p className="text-info">
          Ανανεώστε τη σελίδα ή προσπαθήστε να συνδεθείτε ξανά στο λογαριασμό
          σας!
        </p>
      </Fragment>
    );
  }
  return (
    <Card className="text-wrap" bg="dark" text="light">
      <Card.Body>
        <Card.Title>
          <strong>Στοιχεία Χρήστη</strong>
        </Card.Title>
        <ListGroup.Item>Χρήστης: {user.username || "-"}</ListGroup.Item>
        <ListGroup.Item>Όνομα: {user.firstName || "-"}</ListGroup.Item>
        <ListGroup.Item>Επώνυμο: {user.lastName || "-"}</ListGroup.Item>
        <ListGroup.Item>
          Τύπος Χρήστη:{" "}
          {user.type === "operator"
            ? "Εταιρεία Διαχείρισης"
            : user.type === "admin"
            ? "Διαχειριστής"
            : user.type === "external"
            ? "Εξωτερικός Χρήστης"
            : "-"}
        </ListGroup.Item>
        <ListGroup.Item>
          Αναγνωριστικό Εταιρείας:{" "}
          {user.type === "operator" ? user.operatorId : "-"}
        </ListGroup.Item>
        <ListGroup.Item>Email: {user.email}</ListGroup.Item>
        <ListGroup.Item>
          Τηλέφωνο Επικοινωνίας: {user.mobilePhone}
        </ListGroup.Item>
        <ListGroup.Item className="bg-dark" />
        <ListGroup.Item className="bg-warning">
          Αυτόματη Αποσύνδεση: {expirationTime}
        </ListGroup.Item>
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
