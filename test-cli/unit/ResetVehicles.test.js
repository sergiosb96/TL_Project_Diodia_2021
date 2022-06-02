const ResetVehicles = require("../../cli/src/Scopes/ResetVehicles");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for ResetVehicles class
describe("ResetVehicles class unit testing", () => {
  const scope = new ResetVehicles();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("resetvehicles");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("resetvehicles (no parameters needed)");
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
        description: "Reset Vehicles successfully",
      },
      message: "success",
    };
    // ResetVehicles class is expected to make a POST request
    axios.post.mockResolvedValueOnce(fakeResponse);

    // run ResetVehicles' main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}/admin/resetvehicles`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });
});
