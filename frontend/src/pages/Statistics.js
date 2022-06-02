import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import useHttp from "../hooks/use-http";
import { formatDateTimeString, round } from "../libs/string-manipulation";

import FormOperatorDate from "../components/Forms/FormOperatorDate";
import SelectDisplayType from "../components/Statistics/SelectDisplayType";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Statistics = (props) => {
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
    let loadedStatistics = {};

    // move data from response <dataObj> to <loadedStatistics>
    loadedStatistics.opId = dataObj["op_ID"];
    loadedStatistics.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedStatistics.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedStatistics.to = formatDateTimeString(dataObj.PeriodTo);
    loadedStatistics.stations = [];
    for (let station of dataObj.StationList) {
      loadedStatistics.stations.push({
        id: station.Station,
        numberOfPasses: station.NumberOfPasses,
        cost: round(station.PassesCost, 2),
      });
    }

    setData(loadedStatistics);
  };

  // make GET request to API to GetStatistics - {baseUrl}/getstatistics/:op_ID/:date_from/:date_to
  const submitHandler = async (opId, dateFrom, dateTo) => {
    let url = `${baseUrl}/getstatistics/${opId}/${dateFrom}/${dateTo}`;
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
  // loading is finished and there is an error, display error message
  else if (error) {
    content = <p className="text-danger">Προέκυψε κάποιο σφάλμα: {error}</p>;
  }
  // loading is finished with no errors, and there are some available data
  else if (data && data.stations.length > 0) {
    content = <SelectDisplayType stations={data.stations} />;
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Προβολή στατιστικών</h1>
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

export default Statistics;
