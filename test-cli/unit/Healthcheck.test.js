const Healthcheck = require("../../cli/src/Scopes/Healthcheck");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for Scope class
describe("Healthcheck class unit testing", () => {
  const scope = new Healthcheck();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("healthcheck");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("healthcheck (no parameters needed)");
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
        description: "connection string",
      },
      message: "success",
    };
    // healthcheck class is expected to make a GET request
    axios.get.mockResolvedValueOnce(fakeResponse);

    // run Healthcheck's main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/admin/healthcheck`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });
});
