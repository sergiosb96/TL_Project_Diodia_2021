const Scope = require("../../cli/src/Scope");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for Scope class
describe("Scope class unit testing", () => {
  /*** Test a scope with no parameter sets ***/
  describe("Scope with no parameter sets", () => {
    // create a scope with name "scope" and no parameters
    const scope = new Scope("scope");

    // getName method
    test("getName() getter method", () => {
      expect(scope.getName()).toBe("scope");
    });

    // toString method
    test("toString() method", () => {
      expect(scope.toString()).toBe("scope (no parameters needed)");
    });

    // validateParameters method with/without parameters (should be ignored in any case)
    test("validateParameters() method with/without parameters", () => {
      const parameters = {
        param1: "value1",
        param2: "value2",
      };

      expect(scope.validateParameters(parameters)).toEqual({});
      expect(scope.validateParameters()).toEqual({});
    });

    // constructUrl with dummy url, url parameters and query parameters
    test("constructUrl() method", () => {
      // dummy url, url parameters and query parameters for testing
      const url = "localhost/testing";
      const urlParameters = ["20220224", "123456"];
      const queryParameters = { param1: "valid01 param", format: "json" };

      // construct url with given parameters
      expect(scope.constructUrl(url, urlParameters, queryParameters)).toBe(
        `${url}/${urlParameters[0]}/${urlParameters[1]}?param1=${queryParameters.param1}&format=${queryParameters.format}`
      );

      // construct url with no url or query parameters
      expect(scope.constructUrl(url)).toBe(url);
    });
  });

  /*** Test a scope with just one parameter set ***/
  describe("Scope with single parameter set", () => {
    // create a scope with name "scope" and 3 parameters: an alphanumeric string, a number and date in YYYYMMDD format
    const scope = new Scope("scope", [
      {
        param1: /[a-zA-Z][a-zA-Z0-9_\-]*/,
        param2: /\d+/,
        param3: /\d{8}/,
        format: /^(csv|json)$/,
      },
    ]);

    // getName method
    test("getName() getter method", () => {
      expect(scope.getName()).toBe("scope");
    });

    // toString method
    test("toString() method", () => {
      expect(scope.toString()).toBe(
        "scope --param1 [value] --param2 [value] --param3 [value] --format [value]"
      );
    });

    // validateParameters method with valid parameters
    test("validateParameters() method with valid parameters", () => {
      const validParameters = {
        param1: "valid01_param",
        param2: "123456",
        param3: "20220224",
        format: "json",
      };

      expect(scope.validateParameters(validParameters)).toEqual(
        validParameters
      );
    });

    // validateParameters method with invalid parameters
    test("validateParameters() method with invalid parameters", () => {
      const invalidParameters = {
        param1: "valid01 param",
        param2: "a1234",
        param3: "2020224",
        form: "js",
      };

      expect(scope.validateParameters(invalidParameters)).toBe(undefined);
    });

    // validateParameters method with no parameters
    test("validateParameters() method with no parameters", () => {
      expect(scope.validateParameters()).toBe(undefined);
    });

    // constructUrl with dummy url, url parameters and query parameters
    test("constructUrl() method", () => {
      // dummy url, url parameters and query parameters for testing
      const url = "localhost/testing";
      const urlParameters = ["20220224", "123456"];
      const queryParameters = { param1: "valid01 param", format: "json" };

      // construct url with given parameters
      expect(scope.constructUrl(url, urlParameters, queryParameters)).toBe(
        `${url}/${urlParameters[0]}/${urlParameters[1]}?param1=${queryParameters.param1}&format=${queryParameters.format}`
      );

      // construct url with no url or query parameters
      expect(scope.constructUrl(url)).toBe(url);
    });
  });

  /*** Test a scope with multiple parameter sets ***/
  describe("Scope with multiple parameter sets", () => {
    // create a scope with name "scope" and 2 parameter set
    const scope = new Scope("scope", [
      {
        param1: /[a-zA-Z][a-zA-Z0-9_\-]*/,
        param2: /\d+/,
        param3: /\d{8}/,
        format: /^(csv|json)$/,
      },
      {
        flag: undefined,
        param: /\S+[\.csv]/,
      },
    ]);

    // getName method
    test("getName() getter method", () => {
      expect(scope.getName()).toBe("scope");
    });

    // toString method
    test("toString() method", () => {
      expect(scope.toString()).toBe(
        `scope --param1 [value] --param2 [value] --param3 [value] --format [value]
scope --flag --param [value]`
      );
    });

    // validateParameters method with valid parameters
    test("validateParameters() method with valid parameters", () => {
      // valid parameters matching first parameter set
      const validParameterSet1 = {
        param1: "valid01_param",
        param2: "123456",
        param3: "20220224",
        format: "json",
      };

      expect(scope.validateParameters(validParameterSet1)).toEqual(
        validParameterSet1
      );

      // valid parameters matching second parameter set
      const validParameterSet2 = {
        flag: true,
        param: "text.csv",
      };

      expect(scope.validateParameters(validParameterSet2)).toEqual(
        validParameterSet2
      );
    });

    // validateParameters method with invalid parameters
    test("validateParameters() method with invalid parameters", () => {
      const invalidParameters = {
        flag: undefined,
        param1: "valid01 param",
      };

      expect(scope.validateParameters(invalidParameters)).toBe(undefined);
    });

    // validateParameters method with no parameters
    test("validateParameters() method with no parameters", () => {
      expect(scope.validateParameters()).toBe(undefined);
    });

    // constructUrl with dummy url, url parameters and query parameters
    test("constructUrl() method", () => {
      // dummy url, url parameters and query parameters for testing
      const url = "localhost/testing";
      const urlParameters = ["20220224", "123456"];
      const queryParameters = { param1: "valid01 param", format: "json" };

      // construct url with given parameters
      expect(scope.constructUrl(url, urlParameters, queryParameters)).toBe(
        `${url}/${urlParameters[0]}/${urlParameters[1]}?param1=${queryParameters.param1}&format=${queryParameters.format}`
      );

      // construct url with no url or query parameters
      expect(scope.constructUrl(url)).toBe(url);
    });
  });

  /*** Test Scope's apiCall method ***/
  describe("Scope API call testing", () => {
    // create a scope with name "scope" and 3 parameters: an alphanumeric string, a number and date in YYYYMMDD format
    const scope = new Scope("scope", [
      {
        param1: /[a-zA-Z][a-zA-Z0-9_\-]*/,
        param2: /\d+/,
        param3: /\d{8}/,
        format: /^(csv|json)$/,
      },
    ]);

    // Scope successfull API call with GET method
    test("API call with GET method - success", async () => {
      // mock expected result
      const fakeResponse = {
        status: 200,
        data: { key1: "value1", key2: "value" },
        message: "success",
      };
      axios.get.mockResolvedValueOnce(fakeResponse);

      const url = "localhost/testing";
      const parameters = {
        url: ["20220224", "123456"],
        query: { param1: "valid01 param", format: "json" },
      };

      // make API call (default method is GET)
      const result = await scope.apiCall(url, parameters);

      // check if it was called with the expected URL (note: constructUrl has already been tested) and body (undefined for get requests)
      expect(axios.get).toHaveBeenCalledWith(
        scope.constructUrl(url, parameters.url, parameters.query),
        undefined
      );
      expect(result).toEqual(fakeResponse);
    });

    // Scope failed API call with GET method
    test("API call with GET method - fail", async () => {
      // mock expected result
      axios.get.mockRejectedValueOnce(new Error("Something went wrong"));

      const url = "localhost/testing";
      const parameters = {
        url: ["20220224", "123456"],
        query: { param1: "valid01_param", format: "json" },
      };

      // make API call (default method is GET)
      const result = await scope.apiCall(url, parameters);

      // check if it was called with the expected URL (note: constructUrl has already been tested) and body (undefined for get requests)
      expect(axios.get).toHaveBeenCalledWith(
        scope.constructUrl(url, parameters.url, parameters.query),
        undefined
      );
      expect(result).toEqual({
        message: "Something went wrong",
        status: "Could not send request",
      });
    });

    // Scope successfull API call with POST method
    test("API call with POST method - success", async () => {
      // mock expected result
      const fakeResponse = {
        status: 200,
        data: {},
        message: "success",
      };
      axios.post.mockResolvedValueOnce(fakeResponse);

      const url = "localhost/testing";
      const parameters = {
        url: ["20220224", "123456"],
        query: { param1: "valid01_param", format: "json" },
        body: { test: "test" },
      };

      // make API call with POST method
      const result = await scope.apiCall(url, parameters, "post");

      // check if it was called with the expected URL (note: constructUrl has already been tested) and body (undefined for get requests)
      expect(axios.post).toHaveBeenCalledWith(
        scope.constructUrl(url, parameters.url, parameters.query),
        parameters.body
      );
      expect(result).toEqual(fakeResponse);
    });

    // Scope failed API call with POST method
    test("API call with POST method - fail", async () => {
      // mock expected result
      axios.post.mockRejectedValueOnce(new Error("Something went wrong"));

      const url = "localhost/testing";
      const parameters = {
        url: ["20220224", "123456"],
        query: { param1: "valid01_param", format: "json" },
        body: { test: "test" },
      };

      // make API call with POST method
      const result = await scope.apiCall(url, parameters, "POST");

      // check if it was called with the expected URL (note: constructUrl has already been tested) and body (undefined for get requests)
      expect(axios.post).toHaveBeenCalledWith(
        scope.constructUrl(url, parameters.url, parameters.query),
        parameters.body
      );
      expect(result).toEqual({
        message: "Something went wrong",
        status: "Could not send request",
      });
    });
  });
});
