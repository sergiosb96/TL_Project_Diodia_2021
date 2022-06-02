import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";

import { formatDateString } from "../../libs/string-manipulation";

// Form : Select operator and dates from/to
const FormOperatorDate = (props) => {
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

  // selected operator Id
  const initOp = props.forcedOperator
    ? props.forcedOperator // if forcedOperator is passed through props, set as initial operator
    : props.operators && props.operators.length > 0 // otherwise set to the first available operator
    ? props.operators[0].id
    : null;

  const [operator, setOperator] = useState(initOp);
  const operatorIsValid =
    props.operators &&
    props.operators.length > 0 &&
    operator &&
    props.operators.find((op) => op.id === operator);

  // on form submission - check if all fields are valid and call <onSubmit> function passes from props
  const submitHandler = (event) => {
    event.preventDefault(); // prevent form submission's default action that would reload the page
    // check if all fields (date from/to, operator and station) are valid
    if (dateFromIsValid && dateToIsValid && operatorIsValid) {
      // if valid, call <onSubmit> function passed through props
      props.onSubmit(
        operator,
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
      <Form.Label htmlFor="select-operator" className="text-center">
        Επιλογή Εταιρείας Διαχείρισης
      </Form.Label>
      <Form.Select
        aria-label="Εταιρεία Διαχείρισης"
        name="select-operator"
        isInvalid={!operatorIsValid}
        disabled={isLoading || props.forcedOperator}
        value={operator}
        onChange={(event) => setOperator(event.target.value)}
      >
        {props.operators.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.name}
          </option>
        ))}
      </Form.Select>
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

export default FormOperatorDate;
