const {
  authFileName,
  initializeAuthFile,
  getToken,
  saveToken,
  calculateRemainingTime,
} = require("../../cli/src/utils");

const fs = require("fs");
jest.mock("fs");

// Unit tests for utils module
describe("Utils module unit testing", () => {
  afterEach(() => {
    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();
    fs.existsSync.mockClear();
  });

  const init = {
    token: "",
    expirationDate: "",
  };

  // initializeAuthFile function
  test("initializeAuthFile() function", () => {
    // call function
    initializeAuthFile();

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify(init)
    );

    // check if fs.writeFileSync was called exactly once
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  // getToken method - file exists and has valid data
  test("getToken() method - file exists and has valid data", () => {
    // Mock fs.existsSync to return that the file exists
    fs.existsSync.mockReturnValue(true);

    // fake expected value from reading file
    const validAuthData = {
      token:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQG50dWEuZ3IiLCJmaXJzdE5hbWUiOiJBZCIsImxhc3ROYW1lIjoibWluIiwibW9iaWxlUGhvbmUiOiIyMTAxMjM0NTY3OCIsInR5cGUiOiJhZG1pbiIsIm9wZXJhdG9ySWQiOm51bGx9LCJpYXQiOjE2NDUxMjQyMjIsImV4cCI6MTY0NTcyOTAyMn0.htafJy958q6QRJcG4hSZspLaVFrV3n2Y7OxBoLnIvV0",
      expirationDate: new Date(new Date().getTime() + 60000),
    };
    // Mock fs.existsSync to return that the file exists
    fs.readFileSync.mockReturnValue(JSON.stringify(validAuthData));

    // call function
    const result = getToken();

    // check if fs.existsSync and fs.readFileSync was called exactly once
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      token: validAuthData.token,
      expirationDate: validAuthData.expirationDate.toISOString(),
    });
  });

  // getToken method - file exists and has invalid data
  test("getToken() method - file exists and has invalid data", () => {
    // Mock fs.existsSync to return that the file exists
    fs.existsSync.mockReturnValue(true);

    // fake expected value from reading file
    const invalidAuthData = {
      expirationDate: new Date(new Date().getTime() + 60000),
    };
    // Mock fs.existsSync to return that the file exists
    fs.readFileSync.mockReturnValue(JSON.stringify(invalidAuthData));

    // call function
    const result = getToken();

    // check if fs.existsSync, fs.readFileSync was called exactly once
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify(init)
    );

    expect(result).toEqual(init);
  });

  // getToken method - file does not exist
  test("getToken() method - file does not exist", () => {
    // Mock fs.existsSync to return that the file does not exist
    fs.existsSync.mockReturnValue(false);

    // call function
    const result = getToken();

    // check if fs.existsSync, fs.readFileSync was called exactly once
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify(init)
    );

    expect(result).toEqual(init);
  });

  // saveToken function
  test("saveToken(token, expirationDate) function", () => {
    const fakeData = {
      token:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQG50dWEuZ3IiLCJmaXJzdE5hbWUiOiJBZCIsImxhc3ROYW1lIjoibWluIiwibW9iaWxlUGhvbmUiOiIyMTAxMjM0NTY3OCIsInR5cGUiOiJhZG1pbiIsIm9wZXJhdG9ySWQiOm51bGx9LCJpYXQiOjE2NDUxMjQyMjIsImV4cCI6MTY0NTcyOTAyMn0.htafJy958q6QRJcG4hSZspLaVFrV3n2Y7OxBoLnIvV0",
      expirationDate: new Date(new Date().getTime() + 60000),
    };
    // call function
    saveToken(fakeData.token, fakeData.expirationDate);

    // check if fs.writeFileSync was called with the expected parameters
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      authFileName,
      JSON.stringify(fakeData)
    );

    // check if fs.writeFileSync was called exactly once
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  // calculateRemainingTime function - valid expiration time parameter
  test("calculateRemainingTime(expirationTime) function - valid expiration time parameter", () => {
    const expectedDifference = 60000; // milliseconds
    const expirationTime = new Date(new Date().getTime() + expectedDifference);

    // call function
    const result = calculateRemainingTime(expirationTime);

    // expect remaining time to be equal to <expectedDifference>
    expect(result).toEqual(expectedDifference);
  });

  // calculateRemainingTime function - invalid expiration time parameter
  test("calculateRemainingTime(expirationTime) function - invalid expiration time parameter", () => {
    const invalidExpirationTime = "invalid";

    // call function
    const result = calculateRemainingTime(invalidExpirationTime);

    // expect remaining time to be equal to <expectedDifference>
    expect(result).toBe(null);
  });
});
