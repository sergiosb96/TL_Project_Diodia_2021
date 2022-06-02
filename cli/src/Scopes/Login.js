const Scope = require("../Scope");
const { saveToken } = require("../utils");

const scopeName = "login";
const method = "post";

/* Array of all different sets of required parameters, in case there can be more than one set of parameters.
 * Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 * a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 * needed for the specific parameterName.
 */
const scopeParameters = [
  {
    username: /[a-zA-Z0-9]+/,
    passw: /\S+/,
  },
];

// Login endpoint: {baseUrl}/login
class Login extends Scope {
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
      body: {
        username: parametersObject.username, // username
        password: parametersObject.passw.toString(), // password
      },
    };

    // make call to the API
    let result = await this.apiCall(endpointUrl, apiParameters, method);
    // if request succeeded and status is 200 (OK), save token and print the data
    if (result.status && result.status === 200) {
      // get token and expiration date from response
      const token = result.data.data.token;
      const expiresIn = +result.data.data.tokenExpiresInSecs;
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      // save data to auth file
      saveToken(token, expirationDate);
      // return the result
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

module.exports = Login;
