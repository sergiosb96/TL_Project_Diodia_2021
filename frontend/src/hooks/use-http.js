import { useState, useCallback } from "react";
// axios - used for HTTP requests
import axios from "axios";

/* Custom hook in order to make http requests to API
 *
 * Returns:
 * isLoading (boolean): request is in progress
 * error (string): request failed - this holds the error message
 * sendRequest (function): used to make http request
 */
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false); // request is in progress (initially false)
  const [error, setError] = useState(null); // error message (initially null)

  /* Send http request to an API, as configured on the given parameter <requestConfig>. Accepts two parameters:
   * - requestConfig : object that consists of url (string) of the API endpoint where the request should be sent,
   *    method (string) of the request (if none is passed, default method is GET),
   *    token: if set, Authorization header is set
   *    params (URLSearchParams),
   *    data(body) of the request (if not passed, default is null) and
   *    headers of the request (if not passed, default is empty object)
   * - applyData : callback function to be executed in case of success
   */
  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true); // request now is in progress
    setError(null); // remove any pre-existing errors

    // if authorization token parameter is passed, set the Authorization headers
    if (requestConfig.token) {
      axios.defaults.headers.common = { Authorization: requestConfig.token };
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    try {
      // create the configuration for axios http request, as defined on <requestConfig> parameter
      const config = {
        url: requestConfig.url,
        method: requestConfig.method ? requestConfig.method : "GET",
        params: requestConfig.params ? requestConfig.params : null,
        data: requestConfig.data ? requestConfig.data : null,
        headers: requestConfig.headers ? requestConfig.headers : {},
      };

      const response = await axios(config); // make http request using axios library with the constructed config object

      // in case of success, run the callback function passed in <applyData> parameter (otherwise the catch block will be executed)
      applyData(response.data);
    } catch (error) {
      // an error has occured making the request - set the error state's message depending on type of error

      // request was made and server responded with a status code that signals an error (different than 2xx)
      if (error.response) {
        setError(error.message);
      }
      // request was made, but no response was received from the server
      else if (error.request) {
        setError("No response received from the server");
      }
      // request could not be sent (something happened in setting up the request)
      else {
        setError(error.message);
      }
    }

    setIsLoading(false); // request finished (with or without error) - reset the <isLoading> flag
  }, []);

  // return the two available states and <sendRequest> method
  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
