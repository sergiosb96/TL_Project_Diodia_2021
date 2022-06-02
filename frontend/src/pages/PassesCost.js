import React, { Fragment, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

import useHttp from "../hooks/use-http";
import {
  formatDateString,
  formatDateTimeString,
  round,
} from "../libs/string-manipulation";

import FormTwoOperatorsDate from "../components/Forms/FormTwoOperatorsDate";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const PassesCost = (props) => {
  // base URL for API requests
  const baseUrl = props.baseUrl;

  // get operators from store
  const operators = useSelector((state) => state.operators.operators);

  // get current authentication state from store
  const { isLoggedIn, token, profile } = useSelector((state) => state.auth);
  const isOperator = isLoggedIn && profile.type === "operator";
  let forcedOperator = null;
  // if logged in user is an operator, force operator on form to be the logged in operator
  if (isOperator) {
    let op = operators.find((operator) => operator.id === profile.operatorId);
    forcedOperator = op ? op.id : null;
  }

  // response data from API request (initially no data)
  const [data, setData] = useState();

  // custom hook to make http requests
  const { isLoading, error, sendRequest } = useHttp();

  // transform API response to data object (used as callback for useHttp hook)
  const transformData = (dataResponse) => {
    let dataObj = dataResponse.data;
    let loadedCostData = {};

    // move data from response <dataObj> to <loadedCostData>
    loadedCostData.op1Id = dataObj["op1_ID"];
    loadedCostData.op2Id = dataObj["op2_ID"];
    loadedCostData.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedCostData.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedCostData.to = formatDateTimeString(dataObj.PeriodTo);
    loadedCostData.numberOfPasses = dataObj.NumberOfPasses;
    loadedCostData.cost = round(dataObj.PassesCost, 2);

    setData(loadedCostData);
  };

  // make GET request to API to get PassesAnalysis - {baseUrl}/passesanalysis/:op1_ID/:op2_ID/:date_from/:date_to
  const submitHandler = async (op1Id, op2Id, dateFrom, dateTo) => {
    let url = `${baseUrl}/passescost/${op1Id}/${op2Id}/${dateFrom}/${dateTo}`;
    sendRequest(
      {
        url,
        token,
      },
      transformData
    );
  };

  // content to be displayed: initially assume there is no data, display message
  let content = <p>Δε βρέθηκαν δεδομένα για το επιλεγμένο χρονικό διάστημα</p>;

  // no data for operators
  if (operators.length === 0) {
    content = (
      <p>
        Δε βρέθηκαν δεδομένα. Ελέγξτε τη σύνδεσή σας στο διαδίκτυο και ανανεώστε
        τη σελίδα.
      </p>
    );
  }
  // if request is in progress show spinner and loading message
  else if (isLoading) {
    content = (
      <Fragment>
        <LoadingSpinner />
        <p>Φόρτωση δεδομένων...</p>
      </Fragment>
    );
  }
  // if request finished with an error, show error message
  else if (error) {
    content = <p className="text-danger">Προέκυψε κάποιο σφάλμα: "{error}"</p>;
  }
  // request finished with no errors, and there are some available data
  else if (data) {
    let op1Name = operators.find((operator) => operator.id === data.op1Id);
    op1Name = op1Name ? op1Name.name : data.op2Id;
    let op2Name = operators.find((operator) => operator.id === data.op2Id);
    op2Name = op2Name ? op2Name.name : data.op2Id;
    content = (
      <Card className="text-wrap" bg="dark" text="light">
        <Card.Body>
          <Card.Title>
            <strong>{`${op1Name} (${data.op1Id})`} - Χρεώσεις</strong>
          </Card.Title>
          <Card.Text>
            Αριθμός και κόστος των γεγονότων διέλευσης που πραγματοποιήθηκαν με
            tag της εταιρείας <em>{`${op2Name} (${data.op2Id})`}</em>.
          </Card.Text>
          <ListGroup.Item>
            Από: {formatDateString(data.from, "/")}
          </ListGroup.Item>
          <ListGroup.Item>Έως: {formatDateString(data.to, "/")}</ListGroup.Item>
          <ListGroup.Item>Διελεύσεις: {data.numberOfPasses}</ListGroup.Item>
          <ListGroup.Item>Χρέωση: {data.cost}</ListGroup.Item>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Κόστος Διελεύσεων</h1>
      {operators.length > 0 && (
        <FormTwoOperatorsDate
          operators={operators}
          onSubmit={submitHandler}
          isLoading={isLoading}
          forcedOperator={forcedOperator}
        />
      )}
      <div className="my-3">{content}</div>
    </div>
  );
};

export default PassesCost;
