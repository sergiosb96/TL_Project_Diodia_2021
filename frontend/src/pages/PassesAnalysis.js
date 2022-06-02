import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import useHttp from "../hooks/use-http";
import { formatDateTimeString, round } from "../libs/string-manipulation";

import FormTwoOperatorsDate from "../components/Forms/FormTwoOperatorsDate";
import PagedTable from "../components/UI/PagedTable";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const PassesAnalysis = (props) => {
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
    let loadedAnalysisData = {};

    // move data from response <dataObj> to <loadedAnalysisData>
    loadedAnalysisData.op1Id = dataObj["op1_ID"];
    loadedAnalysisData.op2Id = dataObj["op2_ID"];
    loadedAnalysisData.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedAnalysisData.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedAnalysisData.to = formatDateTimeString(dataObj.PeriodTo);
    loadedAnalysisData.numberOfPasses = dataObj.NumberOfPasses;
    loadedAnalysisData.passes = [];
    for (let pass of dataObj.PassesList) {
      loadedAnalysisData.passes.push({
        index: pass.PassIndex, // index of pass (1-numberOfPasses)
        id: pass.PassID, // unique ID of the pass
        stationId: pass.StationID, // unique ID of the station where the pass occured
        timestamp: formatDateTimeString(pass.TimeStamp), // timestamp when pass occured
        vehicleId: pass.VehicleID, // unique ID of the passed vehicle
        charge: round(pass.Charge, 2), // charge of the pass (in euros)
      });
    }

    setData(loadedAnalysisData);
  };

  // make GET request to API to get PassesAnalysis - {baseUrl}/passesanalysis/:op1_ID/:op2_ID/:date_from/:date_to
  const submitHandler = async (op1Id, op2Id, dateFrom, dateTo) => {
    let url = `${baseUrl}/passesanalysis/${op1Id}/${op2Id}/${dateFrom}/${dateTo}`;
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
    content = (
      <PagedTable
        // set <items> prop to display all passes
        items={data.passes}
        // set table's <columns> props to all key values in each pass object, with their descriptions to be displayed as column headers
        columns={[
          { id: "index", description: "Α/Α" },
          { id: "id", description: "Αναγνωριστικό" },
          { id: "stationId", description: "Σταθμός" },
          { id: "timestamp", description: "Ώρα Διέλευσης" },
          { id: "vehicleId", description: "'Οχημα" },
          { id: "charge", description: "Χρέωση (€)" },
        ]}
        showSearch={true}
      />
    );
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Ανάλυση διελεύσεων μεταξύ εταιρειών</h1>
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

export default PassesAnalysis;
