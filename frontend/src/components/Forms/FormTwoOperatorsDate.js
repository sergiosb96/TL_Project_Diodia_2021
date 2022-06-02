import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";

import { formatDateString } from "../../libs/string-manipulation";

// Form : Select operator 1, operator 2 and dates from/to
const FormTwoOperatorsDate = (props) => {
  const isLoading = props.isLoading; // get <isLoading> status from props (for display and disable button)

  // selected date from (initialize with current date)
  const [dateFrom, setDateFrom] = useState(formatDateString(new Date(), "-"));
  const dateFromIsValid =
    dateFrom && new Date(dateFrom).toString() !== "Invalid date";

  // selected date to (initialize with current date)
  const [dateTo, setDateTo] = useState(formatDateString(new Date(), "-"));
  const dateToIsValid =
    dateTo &&
    new Date(dateTo).toString() !== "Invalid date" &&
    (!dateFromIsValid || dateTo >= dateFrom);

  // selected operator 1 Id
  const initOp1 = props.forcedOperator
    ? props.forcedOperator // if forcedOperator is passed through props, set as initial operator
    : props.operators && props.operators.length > 0 // otherwise set to the first available operator
    ? props.operators[0].id
    : null;

  const [operator1, setOperator1] = useState(initOp1);
  const operator1IsValid =
    props.operators &&
    props.operators.length > 0 &&
    operator1 &&
    props.operators.find((op) => op.id === operator1);

  // selected operator 2 Id
  const [operator2, setOperator2] = useState(
    props.operators && props.operators.length > 0 ? props.operators[0].id : null
  );
  const operator2IsValid =
    props.operators &&
    props.operators.length > 0 &&
    operator2 &&
    props.operators.find((op) => op.id === operator2);

  // on form submission - check if all fields are valid and call <onSubmit> function passes from props
  const submitHandler = (event) => {
    event.preventDefault(); // prevent form submission's default action that would reload the page
    // check if all fields (date from/to, operator 1 and operator 2) are valid
    if (
      dateFromIsValid &&
      dateToIsValid &&
      operator1IsValid &&
      operator2IsValid //&&
      // operator1 !== operator2
    ) {
      // if valid, call <onSubmit> function passed through props
      props.onSubmit(
        operator1,
        operator2,
        formatDateString(dateFrom, ""),
        formatDateString(dateTo, "")
      );
    }
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="rounded border border-dark px-4 py-0"
    >
      <Row>
        <Col xs={12} md={6}>
          <Form.Label htmlFor="select-operator-1" className="text-center">
            Επιλογή Εταιρείας Διαχείρισης
          </Form.Label>
          <Form.Select
            aria-label="Εταιρεία Διαχείρισης"
            name="select-operator-1"
            isInvalid={!operator1IsValid}
            disabled={isLoading || props.forcedOperator}
            value={operator1}
            onChange={(event) => setOperator1(event.target.value)}
          >
            {props.operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={6}>
          <Form.Label htmlFor="select-operator-2" className="text-center">
            Επιλογή Εταιρείας Διαχείρισης
          </Form.Label>
          <Form.Select
            aria-label="Εταιρεία Διαχείρισης"
            name="select-operator-2"
            isInvalid={!operator2IsValid}
            disabled={isLoading}
            value={operator2}
            onChange={(event) => setOperator2(event.target.value)}
          >
            {props.operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Label htmlFor="select-date-from" className="text-center">
            Ημερομηνία Από
          </Form.Label>
          <Form.Control
            name="select-date-from"
            type="date"
            isInvalid={!dateFromIsValid}
            disabled={isLoading}
            max={new Date().toISOString().split("T")[0]}
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </Col>
        <Col>
          <Form.Label htmlFor="select-date-to" className="text-center">
            Ημερομηνία Έως
          </Form.Label>
          <Form.Control
            name="select-date-to"
            type="date"
            isInvalid={!dateToIsValid}
            disabled={isLoading}
            max={new Date().toISOString().split("T")[0]}
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </Col>
      </Row>

      <div className="d-grid gap-2 mx-0 my-2">
        <Button type="submit" variant="dark" size="lg" disabled={isLoading}>
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              variant="light"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          Προβολή
        </Button>
      </div>
    </Form>
  );
};

export default FormTwoOperatorsDate;
