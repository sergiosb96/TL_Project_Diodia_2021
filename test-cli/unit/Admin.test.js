const Admin = require("../../cli/src/Scopes/Admin");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;
const fs = require("fs");

jest.mock("../../cli/node_modules/axios");
jest.mock("fs");

// Unit tests for Admin class
describe("Admin class unit testing", () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  const scope = new Admin();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("admin");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString())
      .toBe(`admin --usermod --username [value] --passw [value]
admin --users [value]
admin --passesupd --source [value]`);
  });

  // run method with valid parameters for first parameter set (--usermod --username [value] --passw [value]) - Success
  test("run() method with valid parameters for first parameter set (--usermod --username [value] --passw [value])", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      usermod: true,
      username: "admin",
      passw: "123456",
    };

    // run Admin's main function (--usermod --username [value] --passw [value])
    const result = await scope.run(baseUrl, parameters);
    expect(result).toEqual(JSON.stringify(parameters));
  });

  // run method with valid parameters for second parameter set (--users [value]) - Success
  test("run() method with valid parameters for second parameter set (--users [value])", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      users: "admin",
    };

    // run Admin's main function (--users [value])
    const result = await scope.run(baseUrl, parameters);
    expect(result).toEqual(JSON.stringify(parameters));
  });

  // run method with valid parameters for third parameter set (--passesupd --source [value]) - Fail (source file does not exist)
  test("run() method with valid parameters for third parameter set (--passesupd --source [value]) - Source file does not exist", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      passesupd: true,
      source: "passes.csv",
    };

    // Mock fs.existsSync to return that the file does not exist
    fs.existsSync.mockReturnValue(false);

    // run Admin's main function (--passesupd --source [value])
    const result = await scope.run(baseUrl, parameters);
    expect(result).toEqual(
      JSON.stringify({
        message: `Specified file ${parameters.source} given as --source parameter does not exist.`,
      })
    );
  });

  // run method with valid parameters for third parameter set (--passesupd --source [value]) - Success (source file exists and axios.post is successfull)
  test("run() method with valid parameters for third parameter set (--passesupd --source [value]) - Source file exists and axios.post is successfull", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      passesupd: true,
      source: "passes.csv",
    };

    // Mock fs.existsSync to return that the file exists
    fs.existsSync.mockReturnValue(true);

    // Admin class is expected to make POST requests
    axios.post.mockResolvedValue({
      status: 200,
    });

    // Mock passesUpdate function to skip csv file reading - replace with <fakePasses> and call <insertPasses>
    const fakePasses = [
      {
        passID: "asdfasdf",
        passTime: "2022-02-17 13:12:00",
        stationID: "AO00",
        vehicleID: "ABCDEFGHIJKL",
        charge: "1.23",
      },
      {
        passID: "qwerty",
        passTime: "2022-02-18 01:14:00",
        stationID: "KO00",
        vehicleID: "BCDEFGHIJKLM",
        charge: "2.34",
      },
      {
        passID: "uiop",
        passTime: "2022-02-18 00:00:00",
        stationID: "AO12",
        vehicleID: "CDEFGHIJKLMN",
        charge: "3.45",
      },
      {
        passID: "ghjkl",
        passTime: "2022-02-22 12:34:56",
        stationID: "MR00",
        vehicleID: "DEFGHIJKLMNO",
        charge: "4.56",
      },
      {
        passID: "zxcvb",
        passTime: "1111-11-11 11:11:11",
        stationID: "AO11",
        vehicleID: "EFGHIJKLMNOP",
        charge: "11.11",
      },
    ];
    const fakeCsvResponse = {
      PassesInUploadedFile: fakePasses.length,
      PassesImported: fakePasses.length,
      FailedPasses: [],
    };

    let passesUpdateSpy = jest
      .spyOn(scope, "passesUpdate")
      .mockImplementation(async (endpointUrl, csvFile) => {
        let { passesImported, failedPasses } = await scope.insertPasses(
          endpointUrl,
          fakePasses
        );
        return {
          PassesInUploadedFile: fakePasses.length,
          PassesImported: passesImported,
          FailedPasses: failedPasses,
        };
      });

    // run Admin's main function (--passesupd --source [value])
    const result = await scope.run(baseUrl, parameters);

    expect(axios.post).toHaveBeenCalledTimes(fakePasses.length);
    expect(result).toEqual(JSON.stringify(fakeCsvResponse));
  });

  // run method with valid parameters for third parameter set (--passesupd --source [value]) - Success (source file exists and axios.post failed)
  test("run() method with valid parameters for third parameter set (--passesupd --source [value]) - Source file exists and axios.post failed", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      passesupd: true,
      source: "passes.csv",
    };

    // Mock fs.existsSync to return that the file exists
    fs.existsSync.mockReturnValue(true);

    // Admin class is expected to make POST requests - Mock as failed
    axios.post.mockResolvedValue({
      status: 400,
    });

    // Mock passesUpdate function to skip csv file reading - replace with <fakePasses> and call <insertPasses>
    const fakePasses = [
      {
        passID: "asdfasdf",
        passTime: "2022-02-17 13:12:00",
        stationID: "AO00",
        vehicleID: "ABCDEFGHIJKL",
        charge: "1.23",
      },
      {
        passID: "qwerty",
        passTime: "2022-02-18 01:14:00",
        stationID: "KO00",
        vehicleID: "BCDEFGHIJKLM",
        charge: "2.34",
      },
      {
        passID: "uiop",
        passTime: "2022-02-18 00:00:00",
        stationID: "AO12",
        vehicleID: "CDEFGHIJKLMN",
        charge: "3.45",
      },
      {
        passID: "ghjkl",
        passTime: "2022-02-22 12:34:56",
        stationID: "MR00",
        vehicleID: "DEFGHIJKLMNO",
        charge: "4.56",
      },
      {
        passID: "zxcvb",
        passTime: "1111-11-11 11:11:11",
        stationID: "AO11",
        vehicleID: "EFGHIJKLMNOP",
        charge: "11.11",
      },
    ];
    const fakeCsvResponse = {
      PassesInUploadedFile: fakePasses.length,
      PassesImported: 0,
      FailedPasses: fakePasses,
    };

    let passesUpdateSpy = jest
      .spyOn(scope, "passesUpdate")
      .mockImplementation(async (endpointUrl, csvFile) => {
        let { passesImported, failedPasses } = await scope.insertPasses(
          endpointUrl,
          fakePasses
        );
        return {
          PassesInUploadedFile: fakePasses.length,
          PassesImported: passesImported,
          FailedPasses: failedPasses,
        };
      });

    // run Admin's main function (--passesupd --source [value])
    const result = await scope.run(baseUrl, parameters);

    expect(axios.post).toHaveBeenCalledTimes(fakePasses.length);
    expect(result).toEqual(JSON.stringify(fakeCsvResponse));
  });

  // run method with invalid parameters - Fail
  test("run() method with invalid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      usermod: true,
    };

    // run Admin's main function
    const result = await scope.run(baseUrl, parameters);
    // no requests made - invalid parameters message should be returned
    expect(result).toEqual(scope.invalidParametersMessage());
  });
});
