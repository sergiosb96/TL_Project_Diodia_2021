import { query } from "./db.js";

// Return selected format type (json(default) or csv)
export const getFormat = (format = "json") => {
  return format.toLowerCase() === "csv" ? "csv" : "json";
};

// Convert date string from YYYYMMDD format to YYYY-MM-DD
export const dateStringConverter = (dateString) => {
  const temp = "" + dateString;
  return `${temp.slice(0, 4)}-${temp.slice(4, 6)}-${temp.slice(6, 8)}`;
};

// Return array of all stations for a specific provider, given the provider's <opID>
// Each station's object consists of {id, name}
export const getAllStations = async (opID) => {
  const allStationsRows = await query(
    "SELECT stationId, stationName FROM stations WHERE stationProvider = (?)",
    [opID]
  );
  if (allStationsRows && allStationsRows.length > 0) {
    return allStationsRows.map((station) => {
      return {
        id: station["stationId"],
        name: station["stationName"],
      };
    });
  } else {
    return [];
  }
};

// Return array of all available operators.
// Each operator's object consists of {id, name, abbr}
export const getAllOperators = () => {
  const allOperatorsRows = query("SELECT * FROM operators");
  if (allOperatorsRows && allOperatorsRows.length > 0) {
    return allOperatorsRows.map((operator) => {
      return {
        id: operator["opID"],
        name: operator["opName"],
        abbr: operator["opAbbr"],
      };
    });
  } else {
    return [];
  }
};

export const sendResponse = (
  res,
  status,
  body = undefined,
  format = "json"
) => {
  switch (status) {
    case 200: // Success
      try {
        // TODO: check for CSV format
        return res.status(status).json({
          data: body,
        });
      } catch (error) {}
    case 400: // Bad Request
      return res.status(status).json({ message: "Bad Request" });
    case 401: // Not Authorized
      return res.status(status).json({ message: "Not Authorized" });
    case 402: // No Data
      return res.status(status).json({ message: "No Data" });
    case 500: // Internal Server Error
    default:
      return res.status(500).json({ message: "Internal Server Error" });
  }
};
