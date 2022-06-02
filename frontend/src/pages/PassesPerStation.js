import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import useHttp from "../hooks/use-http";
import { formatDateTimeString, round } from "../libs/string-manipulation";

import FormOperatorStationDate from "../components/Forms/FormOperatorStationDate";
import PagedTable from "../components/UI/PagedTable";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const PassesPerStation = (props) => {
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
    let loadedStationData = {};

    // move data from response <dataObj> to <loadedStationData>
    loadedStationData.stationId = dataObj.Station;
    loadedStationData.operatorId = dataObj.StationOperator;
    loadedStationData.requestTimestamp = formatDateTimeString(
      dataObj.RequestTimestamp
    );
    loadedStationData.from = formatDateTimeString(dataObj.PeriodFrom);
    loadedStationData.to = formatDateTimeString(dataObj.PeriodTo);
    loadedStationData.numberOfPasses = dataObj.NumberOfPasses;
    loadedStationData.passes = [];
    for (let pass of dataObj.PassesList) {
      loadedStationData.passes.push({
        index: pass.PassIndex, // index of pass (1-numberOfPasses)
        id: pass.PassID, // unique ID of the pass
        timestamp: formatDateTimeString(pass.PassTimeStamp), // timestamp when pass occured
        vehicleId: pass.VehicleID, // unique ID of the passed vehicle
        tagProvider: pass.TagProvider, // operator ID
        passType: pass.PassType, // "home" or "visitor"
        charge: round(pass.PassCharge, 2), // charge of the pass (in euros)
      });
    }

    setData(loadedStationData);
  };

  // make GET request to API to get PassesPerStation - {baseUrl}/passesperstation/:stationID/:date_from/:date_to
  const submitHandler = async (stationId, dateFrom, dateTo) => {
    let url = `${baseUrl}/passesperstation/${stationId}/${dateFrom}/${dateTo}`;
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
          { id: "timestamp", description: "Ώρα Διέλευσης" },
          { id: "tagProvider", description: "Πάροχος Πομπού" },
          { id: "vehicleId", description: "'Οχημα" },
          { id: "passType", description: "Είδος Διέλευσης" },
          { id: "charge", description: "Χρέωση (€)" },
        ]}
        showSearch={true}
      />
    );
  }

  return (
    <div className="w-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">Ανάλυση διελεύσεων ανά σταθμό</h1>
      {operators.length > 0 && (
        <FormOperatorStationDate
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

export default PassesPerStation;
