const Scope = require("../Scope");
// import utils file
const { getToken } = require("../utils");

const scopeName = "passesperstation";
const method = "get";

/* Array of all different sets of required parameters, in case there can be more than one set of parameters.
 * Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 * a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 * needed for the specific parameterName.
 */
const scopeParameters = [
  {
    station: /[a-zA-Z][a-zA-Z0-9_\-]*/,
    datefrom: /\d{8}/,
    dateto: /\d{8}/,
    format: /^(csv|json)$/,
  },
];

// PassesPerStation endpoint: {baseUrl}/PassesPerStation/:stationID/:date_from/:date_to
class PassesPerStation extends Scope {
  constructor() {
    super(scopeName, scopeParameters);
  }

  /* function: Run this scope's base function, depending on given <parameters>.
   * First try to <validateParameters>: if provided parameters are invalid, show message to user, otherwise
   * a <parametersObject> is constructed with key-value pairs for each required parameter.
   * Make a call to the API and return the results.
   */
  async run(baseUrl, parameters) {
    const parametersObject = this.validateParameters(parameters);
    // provided parameters are not valid - return error message
    if (!parametersObject) {
      return this.invalidParametersMessage();
    }

    // construct the endpoint URL string to send the http request to
    const endpointUrl = `${baseUrl}/${scopeName}`;

    // construct the parameters object for API call
    const apiParameters = {
      url: [
        parametersObject.station, // /:stationID
        parametersObject.datefrom, // /:date_from
        parametersObject.dateto, // /:date_to
      ],
      query: {
        format: parametersObject.format, // query parameters: select response format (either json or csv)
      },
    };

    // get saved token (if any)
    const { token } = getToken();

    // make call to the API
    let result = await this.apiCall(endpointUrl, apiParameters, method, token);
    // if request succeeded and status is 200 (OK), print the data
    if (result.status && result.status === 200) {
      return parametersObject.format === "csv"
        ? result.data
        : JSON.stringify(result.data);
    }
    // else return the message returned
    else {
      const response = {
        status: result.status || "No status",
        message: `${result.message} ${
          result.data ? "(" + result.data.message + ")" : ""
        }`,
      };
      return JSON.stringify(response);
    }
  }
}

module.exports = PassesPerStation;
