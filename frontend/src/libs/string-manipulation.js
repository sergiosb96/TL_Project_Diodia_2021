// convert <num> to <digits> digit string
const numberToString = (num, digits) => {
  return (+num).toLocaleString("en-US", {
    minimumIntegerDigits: digits,
    useGrouping: false,
  });
};

// convert date string to format needed for API calls (YYYYMMDD)
export const formatDateString = (dateString, joinCharacter = "") => {
  // construct Date object from passed in <dateString>
  let dt = new Date(dateString);
  if (dt.toString() === "Invalid date") {
    return undefined; // if given <dateString> could not be converted to a Date object return undefined
  }

  // otherwise return the formatted string (NOTE: getMonth() return value is 0-11)
  let year = numberToString(dt.getFullYear(), 4);
  let month = numberToString(dt.getMonth() + 1, 2);
  let date = numberToString(dt.getDate(), 2);
  return `${year}${joinCharacter}${month}${joinCharacter}${date}`;
};

// convert datetime string for better display
export const formatDateTimeString = (datetimeString) => {
  const datetime = new Date(datetimeString);
  const offsetMs = datetime.getTimezoneOffset() * 60 * 1000;
  const dateLocal = new Date(datetime.getTime() - offsetMs);
  return dateLocal
    .toISOString()
    .slice(0, 19)
    .replace(/-/g, "/")
    .replace("T", " ");
};

export const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};
