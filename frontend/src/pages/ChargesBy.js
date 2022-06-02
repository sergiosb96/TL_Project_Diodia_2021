import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import useHttp from "../hooks/use-http";
import { formatDateTimeString, round } from "../libs/string-manipulation";

import FormOperatorDate from "../components/Forms/FormOperatorDate";
import SelectDisplayType from "../components/ChargesBy/SelectDisplayType";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ChargesBy = (props) => {
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
    let loadedChargesData = {};

    // move data from response <dataObj> to <loadedChargesData>
    loadedChargesData.opId = dataObj["op_ID"];
    loadedChargesData.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedChargesData.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedChargesData.to = formatDateTimeString(dataObj.PeriodTo);
    loadedChargesData.charges = [];
    for (let op of dataObj.PPOList) {
      let opName = operators.find(
        (operator) => operator.id === op.VisitingOperator
      );
      opName = opName ? opName.name : op.VisitingOperator;
      loadedChargesData.charges.push({
        id: op.VisitingOperator, // unique ID of the visiting operator
        name: opName, // operator's name
        numberOfPasses: op.NumberOfPasses, // number of passes that occured from visiting operator's tags
        cost: round(op.PassesCost, 2), // total cost for all passes (as mentioned above)
      });
    }

    setData(loadedChargesData);
  };

  // make GET request to API to get ChargesBy - {baseUrl}/chargesby/:op_ID/:date_from/:date_to
  const submitHandler = async (opId, dateFrom, dateTo) => {
    let url = `${baseUrl}/chargesby/${opId}/${dateFrom}/${dateTo}`;
    sendRequest(
      {
        url,
        token,
      },
      transformData
    );
  };

  // initial - assume there is no data, display message
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
  // loading is finished and there is an error, display error message
  else if (error) {
    content = <p className="text-danger">Προέκυψε κάποιο σφάλμα: {error}</p>;
  }
  // loading is finished with no errors, and there are some available data
  else if (data && data.charges.length > 0) {
    content = <SelectDisplayType charges={data.charges} />;
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Χρεώσεις προς άλλες εταιρείες</h1>
      {operators.length > 0 && (
        <FormOperatorDate
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

export default ChargesBy;
