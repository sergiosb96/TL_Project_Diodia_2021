/* Each Scope consists of the following elements:
 * name: the scope's name
 * parameterSetsArray: array of all different sets of required parameters, in case there can be more than one set of parameters.
 *        Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 *        a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 *        needed for the specific parameterName.
 *        Note: In any case, the parameter --format csv|json is assumed to be needed
 */

// axios - used for HTTP requests
const axios = require("axios").default;

class Scope {
  constructor(name = "", parameterSetsArray = undefined) {
    this.name = name;
    this.parameterSetsArray = parameterSetsArray;
  }

  // return Scope's name
  getName() {
    return this.name;
  }

  // for display: return Scope's name and all required parameters (or '(no parameters)' if none are needed)
  toString() {
    // if there are no parameter sets (undefined or empty array) return '(no parameters)'
    if (!this.parameterSetsArray || this.parameterSetsArray.length === 0)
      return `${this.name} (no parameters needed)`;

    // return all required parameters for each parameter set, on seperate lines for each parameter set
    return this.parameterSetsArray
      .map((parameterSet) => {
        let str = this.name;
        // for each set of parameters, construct the string to display all required parameters
        for (let parameter in parameterSet) {
          str += ` --${parameter}${parameterSet[parameter] ? " [value]" : ""}`;
        }
        return str;
      })
      .join("\n");
  }

  /* Check if given parameters include all the required parameters for any of the scope's parameter sets and
   * construct an object with all the required parameters and their values
   *
   * If not matched to any, return undefined
   */
  validateParameters(parameters) {
    // if there are no parameter sets (undefined or empty array) return empty object
    if (!this.parameterSetsArray || this.parameterSetsArray.length === 0)
      return {};

    // if no parameters were passed, return undefined (not matched)
    if (!parameters) return undefined;

    // else loop in the array of given parameter sets to check if there is a parameter set that matches the given parameters string
    for (let parameterSet of this.parameterSetsArray) {
      let parametersObject = {}; // initialize parameter object to return - key if the parameter's name, and value is the actual value passed in given <parameters>
      let matched = true; // parameter set has matched all its parameters to given <parameters> object (initialize with true)

      // for each set of parameters, check if all required parameters exist in the passed parameters object
      for (let parameter in parameterSet) {
        if (
          parameters[parameter] && // check: parameter exists inside passed <parameters> object
          (!parameterSet[parameter] || // if parameter doesn't expect a value (undefined), no need to check regular expression
            parameterSet[parameter].test(parameters[parameter])) // otherwise: its value matches the expected regular expression
        ) {
          parametersObject[parameter] = parameters[parameter];
        } else {
          // parameter doesn't exist or doesn't have the expected value
          matched = false;
          break;
        }
      }
      if (matched) {
        return parametersObject;
      }
    }

    // if no matches were made, return undefined
    return undefined;
  }

  // Construct error message and show required parameters
  invalidParametersMessage() {
    return `Invalid parameters for scope ${this.name}.
The parameters that are required for this scope are:
${this.toString()}`;
  }

  // Construct a URL based on given <url>, <urlParameters> and <queryParameters>
  constructUrl(url, urlParameters = [], queryParameters) {
    let urlParametersStr = ""; // initially no url parameters
    // create the parameters string, if there are any
    if (urlParameters && urlParameters.length > 0) {
      urlParametersStr = "/" + urlParameters.join("/");
    }

    let queryParametersStr = ""; // initially no query parameters
    if (queryParameters) {
      queryParametersStr = "?"; // query parameters sting starts ? and all following parameters are joined by & character
      for (let parameter in queryParameters) {
        queryParametersStr += `${parameter}=${queryParameters[parameter]}&`;
      }
      queryParametersStr = queryParametersStr.slice(0, -1); // remove the trailing '&' character from the end of the string
    }
    return url + urlParametersStr + queryParametersStr; // constructed url's form: {endpointUrl}/parameter1/parameter2/...?query1=val1&query2=val2...
  }

  /* Parameters:
   * endpointUrl: the URL of the API's endpoint to send an http request to
   * parameters: an object that consists of:
   *    <url> parameters (array of strings), that should be added on the given <endpointUrl> in order to create a valid <url> for the API call
   *    <body> parameters (object - <key,value>=<parameter name, value>), that should be added in the request's body
   *    <query> parameters (object - <key,value>=<parameter name, value>)
   * method: HTTP method for the request to be sent, should be either "post" or "get" (if not given, default value is "get")
   * token: the token needed for API request (if not given, default is undefined - assume it's not needed)
   *
   * Construct the final <url> using the passed <endpointUrl> and <parameters.url>.
   *
   * Make HTTP request (either GET or POST - based on <method> parameter) and return the status, data & message
   * values from the response (if successful), otherwise return a message that explains the error
   */
  async apiCall(endpointUrl, parameters, method = "get", token = undefined) {
    // construct the final URL by adding the <endpoint> & <query> parameters to the given <endpointUrl>
    let url = this.constructUrl(endpointUrl, parameters.url, parameters.query);

    // if authorization token parameter is passed, set the Authorization headers
    if (token) {
      axios.defaults.headers.common = { Authorization: token };
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    // make HTTP request
    try {
      let response;
      // <method> parameter was passed and its value is equal to "post" (case insensitive): make POST request
      if (method && method.toLowerCase() === "post") {
        response = await axios.post(url, parameters.body);
      }
      // <method> parameter either was not passed, is invalid, or its value is equal to "get": make GET request
      else {
        response = await axios.get(url, parameters.body);
      }

      let status = response.status; // response's status code
      let data = response.data; // response's data
      let message = response.message; // response's message

      return { status, data, message }; // HTTP request was successful - return response's status, data & message as an object
    } catch (error) {
      // HTTP request failed (either error status code, no response, or request could not be sent)
      // request was made and server responded with a status code that signals an error (different than 2xx)
      if (error.response) {
        return {
          status: error.response.status,
          data: error.response.data,
          message: error.message,
        };
      }
      // request was made, but no response was received from the server
      else if (error.request) {
        return {
          status: 504,
          message: "No response received from the server",
        };
      }
      // request could not be sent (something happened in setting up the request)
      else {
        return { status: "Could not send request", message: error.message };
      }
    }
  }
}

module.exports = Scope;
