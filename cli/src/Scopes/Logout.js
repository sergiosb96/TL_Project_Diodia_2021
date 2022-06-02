const Scope = require("../Scope");
// import utils file
const { initializeAuthFile, getToken } = require("../utils");

const scopeName = "logout";
const method = "post";

/* Array of all different sets of required parameters, in case there can be more than one set of parameters.
 * Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 * a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 * needed for the specific parameterName.
 */
const scopeParameters = [];

// Logout endpoint: {baseUrl}/logout
class Logout extends Scope {
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
    const apiParameters = {};

    const { token } = getToken();
    if (!token) {
      return "You are not logged in";
    }

    // make call to the API
    let result = await this.apiCall(endpointUrl, apiParameters, method, token);

    // if request succeeded and status is 200 (OK), print the data and remove saved token from file
    if (result.status && result.status === 200) {
      initializeAuthFile();
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

module.exports = Logout;
