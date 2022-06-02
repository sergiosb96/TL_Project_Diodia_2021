const PassesAnalysis = require("../../cli/src/Scopes/PassesAnalysis");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for PassesAnalysis class
describe("PassesAnalysis class unit testing", () => {
  const scope = new PassesAnalysis();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("passesanalysis");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe(
      "passesanalysis --op1 [value] --op2 [value] --datefrom [value] --dateto [value] --format [value]"
    );
  });

  // run method with valid parameters - Success
  test("run() method with valid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      op1: "aodos",
      op2: "kentriki_odos",
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
        description: "passesAnalysis",
        data: {
          op1_ID: "aodos",
          op2_ID: "kentriki_odos",
          RequestTimestamp: "2022-02-17T13:40:00.123Z",
          PeriodFrom: "2020-01-01T00:00:00.000Z",
          PeriodTo: "2020-03-01T00:00:00.000Z",
          NumberOfPasses: 8,
          PassesList: [
            {
              PassIndex: 1,
              PassID: "dsakfioasdfmasl",
              StationID: "AO00",
              TimeStamp: "2020-01-01T10:11:12:013",
              VehicleID: "ABCDEFGHIJKL",
              Charge: 2.22,
            },
            {
              PassIndex: 2,
              PassID: "lsdalfkmosiofao0",
              StationID: "AO01",
              TimeStamp: "2020-01-01T14:15:16:017",
              VehicleID: "MNOPQRSTUVWX",
              Charge: 3.33,
            },
          ],
        },
      },
      message: "success",
    };

    // PassesAnalysis class is expected to make a GET request
    axios.get.mockResolvedValueOnce(fakeResponse);

    // run PassesAnalysis' main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/passesanalysis/aodos/kentriki_odos/20200101/20200301?format=json`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });

  // run method with invalid parameters - Fail
  test("run() method with invalid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      op1: "aodos",
      datefrom: "20200101",
      dateto: "20200301",
      format: "csv",
    };

    // run PassesAnalysis' main function
    const result = await scope.run(baseUrl, parameters);
    // no requests made - invalid parameters message should be returned
    expect(result).toEqual(scope.invalidParametersMessage());
  });
});
