const ResetStations = require("../../cli/src/Scopes/ResetStations");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for ResetStations class
describe("ResetStations class unit testing", () => {
  const scope = new ResetStations();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("resetstations");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("resetstations (no parameters needed)");
  });

  // run method (no parameters expected) - Success
  test("run() method", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {};

    // mock expected result
    const fakeResponse = {
      status: 200,
      data: {
        status: "OK",
        message: "Success",
        description: "Reset Stations successfully",
      },
      message: "success",
    };
    // ResetStations class is expected to make a POST request
    axios.post.mockResolvedValueOnce(fakeResponse);

    // run ResetStations' main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}/admin/resetstations`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });
});
