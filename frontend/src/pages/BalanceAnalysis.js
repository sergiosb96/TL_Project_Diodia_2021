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

const BalanceAnalysis = (props) => {
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
    let loadedBalanceData = {};

    // move data from response <dataObj> to <loadedBalanceData>
    loadedBalanceData.op1Id = dataObj["op1_ID"];
    loadedBalanceData.op2Id = dataObj["op2_ID"];
    loadedBalanceData.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedBalanceData.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedBalanceData.to = formatDateTimeString(dataObj.PeriodTo);
    loadedBalanceData.op1Cost = round(dataObj.Op1PassesCost, 2);
    loadedBalanceData.op1NumberOfPasses = dataObj.Op1NumberOfPasses;
    loadedBalanceData.op2Cost = round(dataObj.Op2PassesCost, 2);
    loadedBalanceData.op2NumberOfPasses = dataObj.Op2NumberOfPasses;
    loadedBalanceData.balance = round(dataObj.balance, 2);
    loadedBalanceData.debtor = dataObj.debtor;
    loadedBalanceData.paymentCode = dataObj.paymentCode;

    setData(loadedBalanceData);
  };

  // make GET request to API to get BalanceAnalysis - {baseUrl}/balanceanalysis/:op1_ID/:op2_ID/:date_from/:date_to
  const submitHandler = async (op1Id, op2Id, dateFrom, dateTo) => {
    let url = `${baseUrl}/balanceanalysis/${op1Id}/${op2Id}/${dateFrom}/${dateTo}`;
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
            <strong>Oφειλές μεταξύ εταιρειών</strong>
          </Card.Title>
          <Card.Text>
            Υπολογισμός των οφειλών μεταξύ των εταιρειών{" "}
            <em>{`${op1Name} (${data.op1Id})`}</em> και{" "}
            <em>{`${op2Name} (${data.op2Id})`}</em>.
          </Card.Text>
          <ListGroup.Item>
            <strong>Επιλεγμένο χρονικό διάστημα</strong>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>Από</div>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>Έως</div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%" }}>
                {formatDateString(data.from, "/")}
              </div>
              <div style={{ flexBasis: "50%" }}>
                {formatDateString(data.to, "/")}
              </div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>
              {op2Name} προς {op1Name}
            </strong>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>
                Διελεύσεις
              </div>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>Κόστος</div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%" }}>{data.op1NumberOfPasses}</div>
              <div style={{ flexBasis: "50%" }}>{data.op1Cost} €</div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>
              {op1Name} προς {op2Name}
            </strong>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>
                Διελεύσεις
              </div>
              <div style={{ flexBasis: "50%", fontWeight: "bold" }}>Κόστος</div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ flexBasis: "50%" }}>{data.op2NumberOfPasses}</div>
              <div style={{ flexBasis: "50%" }}>{data.op2Cost} €</div>
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            {data.debtor === data.op1Id
              ? `Οφείλετε ${data.balance} € στην εταιρεία ${op2Name}.`
              : `Η εταιρεία ${op2Name} σας oφείλει ${data.balance} €.`}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark" />
          {/* Only show payment code if operator that made the request is the debtor (owes money to op2) */}
          {data.debtor === data.op1Id && (
            <ListGroup.Item className="bg-info">
              <strong>Κωδικός Πληρωμής</strong>
              <p>{data.paymentCode}</p>
            </ListGroup.Item>
          )}
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Ανάλυση οφειλών μεταξύ εταιρειών</h1>
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

export default BalanceAnalysis;
