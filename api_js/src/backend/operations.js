import { query } from "./db.js";

import {
  getFormat,
  dateStringConverter,
  getAllStations,
  sendResponse,
} from "./utils.js";

// PassesPerStation endpoint
const passesPerStation = async (req, res, next) => {
  const format = getFormat(req.query.format); // get format (csv or json) from query parameters
  const stationID = req.params["stationID"]; // get station ID from URL parameters
  const dateFromStr = req.params["date_from"]; // get dateFrom from URL parameters
  const dateToStr = req.params["date_to"]; // get dateTo from URL parameters

  // check if all required parameters were passed
  if (stationID && dateFromStr && dateToStr) {
    // convert passed date strings to date object
    const dateFrom = new Date(dateStringConverter(dateFromStr));
    const dateTo = new Date(dateStringConverter(dateToStr));

    // check if passed dates can be converted to Date objects
    if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
      // query: get provider of given station
      const stationOperatorRows = await query(
        "SELECT stationProvider FROM stations WHERE stationID = (?)",
        [stationID]
      );

      // if operator was found:
      if (stationOperatorRows && stationOperatorRows.length > 0) {
        const stationOperator = stationOperatorRows[0]["stationProvider"];
        let queryString =
          "SELECT passId, passTime, stationId, passes.vehicleId, charge, tagId, tagProvider " +
          "FROM passes INNER JOIN vehicles ON passes.vehicleId = vehicles.vehicleId " +
          "WHERE passes.stationID = (?) AND passes.passTime >= (?) AND passes.passTime <= (?) " +
          "ORDER BY passes.passTime";

        const rows = await query(queryString, [stationID, dateFrom, dateTo]);
        const passesList = [];
        let index = 0;
        for (const row of rows) {
          passesList.push({
            PassIndex: ++index,
            PassID: row["passID"],
            PassTimeStamp: row["passTime"]
              ? new Date(row["passTime"]).toISOString()
              : null,
            VehicleID: row["vehicleID"],
            TagProvider: row["tagProvider"],
            PassType:
              row["tagProvider"] == stationOperator ? "home" : "visitor",
            PassCharge: row["charge"],
          });
        }

        // Success: Return data
        return sendResponse(
          res,
          200,
          {
            Station: stationID,
            StationOperator: stationOperator,
            RequestTimestamp: new Date().toISOString(),
            PeriodFrom: dateFrom.toISOString(),
            PeriodTo: dateTo.toISOString(),
            NumberOfPasses: rows.length,
            PassesList: passesList,
          },
          format
        );
      }
      // No data
      else {
        return sendResponse(res, 402);
      }
    }
  }
  // Bad request
  return sendResponse(res, 400);
};

// PassesAnalysis endpoint
const passesAnalysis = async (req, res, next) => {
  const format = getFormat(req.query.format); // get format (csv or json) from query parameters
  const op1ID = req.params["op1_ID"]; // get operator 1 ID from URL parameters
  const op2ID = req.params["op2_ID"]; // get operator 2 ID from URL parameters
  const dateFromStr = req.params["date_from"]; // get dateFrom from URL parameters
  const dateToStr = req.params["date_to"]; // get dateTo from URL parameters

  if (op1ID && op2ID && dateFromStr && dateToStr) {
    // convert passed date strings to date object
    const dateFrom = new Date(dateStringConverter(dateFromStr));
    const dateTo = new Date(dateStringConverter(dateToStr));

    // check if passed dates can be converted to Date objects
    if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
      const allStations = await getAllStations(op1ID);

      if (allStations.length > 0) {
        let queryString =
          "SELECT passId, passTime, stationId, passes.vehicleID, charge, tagId, tagProvider " +
          "FROM passes INNER JOIN vehicles ON passes.vehicleId = vehicles.vehicleId " +
          "WHERE passes.passTime >= (?) AND passes.passTime <= (?) AND passes.stationID IN (?) " +
          "AND vehicles.tagProvider = (?) ORDER BY passes.passTime";

        const rows = await query(queryString, [
          dateFrom,
          dateTo,
          allStations.map((station) => station.id),
          op2ID,
        ]);
        const passesList = [];
        let index = 0;
        for (const row of rows) {
          passesList.push({
            PassIndex: ++index,
            PassID: row["passID"],
            StationID: row["stationID"],
            TimeStamp: row["passTime"]
              ? new Date(row["passTime"]).toISOString()
              : null,
            VehicleID: row["vehicleID"],
            Charge: row["charge"],
          });
        }

        // Success: Return data
        return sendResponse(
          res,
          200,
          {
            op1_ID: op1ID,
            op2_ID: op2ID,
            RequestTimestamp: new Date().toISOString(),
            PeriodFrom: dateFrom.toISOString(),
            PeriodTo: dateTo.toISOString(),
            NumberOfPasses: rows.length,
            PassesList: passesList,
          },
          format
        );
      }
      // No data
      else {
        return sendResponse(res, 402);
      }
    }
  }
  // Bad request
  return sendResponse(res, 400);
};

// PassesCost endpoint
const passesCost = async (req, res, next) => {
  const format = getFormat(req.query.format); // get format (csv or json) from query parameters
  const op1ID = req.params["op1_ID"]; // get operator 1 ID from URL parameters
  const op2ID = req.params["op2_ID"]; // get operator 2 ID from URL parameters
  const dateFromStr = req.params["date_from"]; // get dateFrom from URL parameters
  const dateToStr = req.params["date_to"]; // get dateTo from URL parameters

  if (op1ID && op2ID && dateFromStr && dateToStr) {
    // convert passed date strings to date object
    const dateFrom = new Date(dateStringConverter(dateFromStr));
    const dateTo = new Date(dateStringConverter(dateToStr));

    // check if passed dates can be converted to Date objects
    if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
      const allStations = await getAllStations(op1ID);

      if (allStations.length > 0) {
        let queryString =
          "SELECT COUNT(*) as length, SUM(charge) as passesCost " +
          "FROM passes INNER JOIN vehicles ON passes.vehicleId = vehicles.vehicleId " +
          "WHERE passes.passTime >= (?) AND passes.passTime <= (?) AND passes.stationId IN (?) " +
          "AND vehicles.tagProvider = (?)";

        const rows = await query(queryString, [
          dateFrom,
          dateTo,
          allStations.map((station) => station.id),
          op2ID,
        ]);
        if (rows && rows.length > 0) {
          const result = rows.pop();
          const length = result["length"] || 0;
          const passesCost = result["passesCost"] || 0;
          // Success: Return data
          return sendResponse(
            res,
            200,
            {
              op1_ID: op1ID,
              op2_ID: op2ID,
              RequestTimestamp: new Date().toISOString(),
              PeriodFrom: dateFrom.toISOString(),
              PeriodTo: dateTo.toISOString(),
              NumberOfPasses: length,
              PassesCost: passesCost,
            },
            format
          );
        }
        // No data
        else {
          return sendResponse(res, 402);
        }
      }
      // No data
      else {
        return sendResponse(res, 402);
      }
    }
  }
  // Bad Request
  return sendResponse(res, 400);
};

// ChargesBy endpoint
const chargesBy = async (req, res, next) => {
  const format = getFormat(req.query.format); // get format (csv or json) from query parameters
  const opID = req.params["op_ID"]; // get operator ID from URL parameters
  const dateFromStr = req.params["date_from"]; // get dateFrom from URL parameters
  const dateToStr = req.params["date_to"]; // get dateTo from URL parameters

  if (opID && dateFromStr && dateToStr) {
    // convert passed date strings to date object
    const dateFrom = new Date(dateStringConverter(dateFromStr));
    const dateTo = new Date(dateStringConverter(dateToStr));

    // check if passed dates can be converted to Date objects
    if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
      const allStations = await getAllStations(opID);

      if (allStations.length > 0) {
        let queryString =
          "SELECT vehicles.tagProvider as visitingOperator, COUNT(*) as numberOfPasses, SUM(charge) as passesCost " +
          "FROM passes INNER JOIN vehicles ON passes.vehicleId = vehicles.VehicleId " +
          "WHERE passes.passTime >= (?) AND passes.passTime <= (?) AND passes.stationId IN (?) " +
          "AND vehicles.tagProvider <> (?) GROUP BY vehicles.tagProvider";

        const rows = await query(queryString, [
          dateFrom,
          dateTo,
          allStations.map((station) => station.id),
          opID,
        ]);

        // Success: Return data
        return sendResponse(
          res,
          200,
          {
            op_ID: opID,
            RequestTimestamp: new Date().toISOString(),
            PeriodFrom: dateFrom.toISOString(),
            PeriodTo: dateTo.toISOString(),
            PPOList: rows.map((row) => {
              return {
                VisitingOperator: row["visitingOperator"],
                NumberOfPasses: row["numberOfPasses"],
                PassesCost: row["passesCost"],
              };
            }),
          },
          format
        );
      }
      // No data
      else {
        return sendResponse(res, 402);
      }
    }
  }
  // Bad request
  return sendResponse(res, 400);
};

// AddPass endpoint
const addPass = async (req, res, next) => {
  const passID = req.body["passID"]; // get pass ID from body parameters
  const stationID = req.body["stationID"]; // get station ID from body parameters
  const vehicleID = req.body["vehicleID"]; // get vehicle ID from body parameters
  const passTimeStr = req.body["passTime"]; // get passTime from body parameters
  const charge = req.body["charge"]; // get charge value from body parameters

  if (passID && stationID && vehicleID && passTimeStr && charge) {
    // convert passed date string to date object (if not given, assume it's equal to current timestamp)
    const passTime = passTimeStr ? new Date(passTimeStr) : new Date();
    
    // check if passed date can be converted to Date object
    if (!isNaN(passTime.getTime())) {
      const insertResult = await query(
        "INSERT INTO passes (passId, stationId,vehicleId,passTime,charge) VALUES (?,?,?,?,?)",
        [passID, stationID, vehicleID, passTime, charge]
      );

      // Success: Return data
      return sendResponse(res, 200, {
        affectedRows: insertResult.affectedRows,
      });
    }
  }
  // Bad request
  return sendResponse(res, 400);
};

// GetStatistics endpoint
const getStatistics = async (req, res, next) => {
  const opID = req.params["op_ID"]; // get operator ID from URL parameters
  const dateFromStr = req.params["date_from"]; // get dateFrom from URL parameters
  const dateToStr = req.params["date_to"]; // get dateTo from URL parameters
  console.log(dateFromStr, dateToStr);
  if (opID && dateFromStr && dateToStr) {
    // convert passed date strings to date object
    const dateFrom = new Date(dateStringConverter(dateFromStr));
    const dateTo = new Date(dateStringConverter(dateToStr));
    
    // check if passed dates can be converted to Date objects
    if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
      const allStations = await getAllStations(opID);
      
      if (allStations.length > 0) {
        let queryString =
          "SELECT passes.stationId as station, COUNT(*) as numberOfPasses, SUM(charge) as passesCost " +
          "FROM passes INNER JOIN vehicles ON passes.vehicleId = vehicles.vehicleId " +
          "WHERE passes.passTime >= (?) AND passes.passTime <= (?) AND passes.stationId IN (?) " +
          "AND vehicles.tagProvider = (?) GROUP BY passes.stationId";
          
        const rows = await query(queryString, [
          dateFrom,
          dateTo,
          allStations.map((station) => station.id),
          opID,
        ]);

        // Success: Return data
        return sendResponse(res, 200, {
          op_ID: opID,
          RequestTimestamp: new Date().toISOString(),
          PeriodFrom: dateFrom.toISOString(),
          PeriodTo: dateTo.toISOString(),
          StationList: rows.map((row) => {
            return {
              Station: row["station"],
              NumberOfPasses: row["numberOfPasses"],
              PassesCost: row["passesCost"],
            };
          }),
        });
      }
      // No data
      else {
        return sendResponse(res, 402);
      }
    }
  }
  // Bad request
  return sendResponse(res, 400);
};

export default {
  passesPerStation,
  passesAnalysis,
  passesCost,
  chargesBy,
  addPass,
  getStatistics,
};
