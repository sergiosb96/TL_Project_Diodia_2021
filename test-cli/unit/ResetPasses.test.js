const ResetPasses = require("../../cli/src/Scopes/ResetPasses");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;

jest.mock("../../cli/node_modules/axios");

// Unit tests for ResetPasses class
describe("ResetPasses class unit testing", () => {
  const scope = new ResetPasses();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("resetpasses");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("resetpasses (no parameters needed)");
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
        description: "Reset Pass successfully",
      },
      message: "success",
    };
    // ResetPasses class is expected to make a POST request
    axios.post.mockResolvedValueOnce(fakeResponse);

    // run ResetPasses' main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.post).toHaveBeenCalledWith(
      `${baseUrl}/admin/resetpasses`,
      undefined
    );
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });
});
