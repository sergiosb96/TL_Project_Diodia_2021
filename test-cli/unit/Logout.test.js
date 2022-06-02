const Logout = require("../../cli/src/Scopes/Logout");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;
const fs = require("fs");
const { authFileName } = require("../../cli/src/utils");

jest.mock("../../cli/node_modules/axios");
jest.mock("fs");

// Unit tests for Logout class
describe("Logout class unit testing", () => {
  const scope = new Logout();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("logout");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("logout (no parameters needed)");
  });

  // run method when user was logged in (no parameters expected) - Success
  test("run() method while user is logged in", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";

    // mock expected result from axios
    const fakeResponse = {
      status: 200,
      data: {
        status: "OK",
        message: "Success",
        description: "Logout Successfully",
      },
      message: "success",
    };

    // Logout class is expected to make a POST request
    axios.post.mockResolvedValueOnce(fakeResponse);

    // mock expexted value from reading file
    const fakeAuthData = {
      token:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQG50dWEuZ3IiLCJmaXJzdE5hbWUiOiJBZCIsImxhc3ROYW1lIjoibWluIiwibW9iaWxlUGhvbmUiOiIyMTAxMjM0NTY3OCIsInR5cGUiOiJhZG1pbiIsIm9wZXJhdG9ySWQiOm51bGx9LCJpYXQiOjE2NDUxMjQyMjIsImV4cCI6MTY0NTcyOTAyMn0.htafJy958q6QRJcG4hSZspLaVFrV3n2Y7OxBoLnIvV0",
      expirationDate: new Date(new Date().getTime() + 60000),
    };

    // Mock fs.existsSync to return that the file exists
    fs.existsSync.mockReturnValue(true);
    // Mock fs.existsSync to return that the file exists
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeAuthData));

    // run Logout's main function
    const result = await scope.run(baseUrl);

    // check if axios was called with the expected URL
    expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/logout`, undefined);

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify({
        token: "",
        expirationDate: "",
      })
    );

    // check if fs.existsSync, fs.readFileSync, fs.writeFileSync were called exactly once
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(JSON.parse(result)).toEqual(fakeResponse.data);
  });

  // run method when user was NOT logged in (no parameters expected)
  test("run() method while user is NOT logged in", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";

    // Mock fs.existsSync to return that the file does not exist
    fs.existsSync.mockReturnValue(false);

    // run Logout's main function
    const result = await scope.run(baseUrl);

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify({
        token: "",
        expirationDate: "",
      })
    );

    // check if fs.existsSync, fs.readFileSync, fs.writeFileSync were called exactly once
    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(result).toBe("You are not logged in");
  });
});
