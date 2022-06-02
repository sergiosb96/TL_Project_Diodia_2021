const ChargesBy = require("../../cli/src/Scopes/ChargesBy");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for ChargesBy class
describe("ChargesBy class unit testing", () => {
  const scope = new ChargesBy();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("chargesby");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe(
      "chargesby --op1 [value] --datefrom [value] --dateto [value] --format [value]"
    );
  });

  // run method with valid parameters - Success
  test("run() method with valid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      op1: "aodos",
      datefrom: "20200101",
      dateto: "20200301",
      format: "json",
    };

    // mock expected result
    const fakeResponse = {
      status: 200,
      data: {
        status: "OK",
        message: "Success",
        description: "chargesBy",
        data: {
          op_ID: "aodos",
          RequestTimestamp: "2022-02-17T13:40:00.123Z",
          PeriodFrom: "2020-01-01T00:00:00.000Z",
          PeriodTo: "2020-03-01T00:00:00.000Z",
          PPOList: [
            {
              VisitingOperator: "egnatia",
              NumberOfPasses: 13,
              PassesCost: 36.4,
            },
            {
              VisitingOperator: "gefyra",
              NumberOfPasses: 15,
              PassesCost: 41.99,
            },
          ],
        },
      },
      message: "success",
    };

    // ChargesBy class is expected to make a GET request
    axios.get.mockResolvedValueOnce(fakeResponse);

    // run ChargesBy's main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/chargesby/aodos/20200101/20200301?format=json`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });

  // run method with invalid parameters - Fail
  test("run() method with invalid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      op1: "a odos",
      datefrom: "2020010",
      dateto: "2020301",
      format: "js",
    };

    // run ChargesBy's main function
    const result = await scope.run(baseUrl, parameters);
    // no requests made - invalid parameters message should be returned
    expect(result).toEqual(scope.invalidParametersMessage());
  });
});
