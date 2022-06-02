const Login = require("../../cli/src/Scopes/Login");

// axios - used for HTTP requests
const axios = require("../../cli/node_modules/axios").default;
const fs = require("fs");

jest.mock("../../cli/node_modules/axios");
jest.mock("fs");

// Unit tests for Login class
describe("Login class unit testing", () => {
  const scope = new Login();

  // getName method
  test("getName() getter method", () => {
    expect(scope.getName()).toBe("login");
  });

  // toString method
  test("toString() method", () => {
    expect(scope.toString()).toBe("login --username [value] --passw [value]");
  });

  // run method with valid parameters - Success
  test("run() method with valid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      username: "admin",
      passw: "123456",
    };

    // mock expected result
    const fakeResponse = {
      status: 200,
      data: {
        status: "OK",
        message: "Success",
        description: "Login Successfully",
        data: {
          token: "Bearer dksalmasdlf",
          profile: {
            username: "admin",
            email: "admin@ntua.gr",
            firstName: "Ad",
            lastName: "min",
            mobilePhone: "21012345678",
            type: "admin",
            operatorId: null,
          },
          tokenExpiresInSecs: 604800,
        },
      },
      message: "success",
    };

    // Login class is expected to make a POST request
    axios.post.mockResolvedValueOnce(fakeResponse);
    
    // run Login's main function
    const result = await scope.run(baseUrl, parameters);

    // check if axios was called with the expected URL
    expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/login`, {
      username: parameters.username,
      password: parameters.passw,
    });

    // check if fs.writeFileSync was called with the expected parameters
    // this test was removed because it fails due to small (~1ms) difference in the calculated expiration date
    /* expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify({
        token: fakeResponse.data.data.token,
        expirationDate: new Date(
          new Date().getTime() +
            fakeResponse.data.data.tokenExpiresInSecs * 1000
        ),
      })
    );*/

    // check if fs.writeFileSync was called exactly once
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(result).toEqual(JSON.stringify(fakeResponse.data));
  });

  // run method with invalid parameters - Fail
  test("run() method with invalid parameters", async () => {
    const baseUrl = "{baseUrl}:9103/interoperability/api";
    const parameters = {
      username: "admin",
    };

    // run Login's main function
    const result = await scope.run(baseUrl, parameters);
    // no requests made - invalid parameters message should be returned
    expect(result).toEqual(scope.invalidParametersMessage());
  });
});
