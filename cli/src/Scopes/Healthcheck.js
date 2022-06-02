const Scope = require("../Scope");

const scopeName = "healthcheck";
const method = "get";

/* Array of all different sets of required parameters, in case there can be more than one set of parameters.
 * Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 * a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 * needed for the specific parameterName.
 */
const scopeParameters = [];

// Healthcheck endpoint: {baseUrl}/admin/healthcheck
class Healthcheck extends Scope {
  constructor() {
    super(scopeName, scopeParameters); // create a Scope object with this scope's name and parameter sets
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
    const endpointUrl = `${baseUrl}/admin/${scopeName}`;

    // construct the parameters object for API call
    const apiParameters = {}; // (no parameters needed for Healthcheck)

    // make call to the API
    let result = await this.apiCall(endpointUrl, apiParameters, method);
    // if request succeeded and status is 200 (OK), print the data
    if (result.status && result.status === 200) {
      return JSON.stringify(result.data);
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

module.exports = Healthcheck;
