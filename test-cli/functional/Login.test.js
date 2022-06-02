const spawn = require("child_process").spawn;

describe("Login functional testing", () => {
  // Test login call with invalid parameters (or no parameters)
  test("Login test - invalid parameters", (done) => {
    const main = spawn("se2188", ["login"], {
      shell: true,
    });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      const output = Buffer.concat(tempOutput).toString();
      try {
        expect(output).toEqual(`Invalid parameters for scope login.
The parameters that are required for this scope are:
login --username [value] --passw [value]
`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test login call with valid but incorrect parameters (eg wrong password)
  test("Login test - valid but incorrect parameters", (done) => {
    const main = spawn(
      "se2188",
      ["login", "--username", "admin", "--passw", "12345"],
      { shell: true }
    );

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      // convert JSON output to an object
      const output = JSON.parse(Buffer.concat(tempOutput).toString());
      // expect to have any of the following status codes
      try {
        expect(output).toHaveProperty("status");
        expect(output).toHaveProperty("message");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test login call with valid and correct parameters (JSON format)
  test("Login test - valid and correct parameters", (done) => {
    const main = spawn(
      "se2188",
      ["login", "--username", "admin", "--passw", "123456"],
      { shell: true }
    );

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      // convert JSON output to an object
      const output = JSON.parse(Buffer.concat(tempOutput).toString());

      try {
        expect(output).toHaveProperty("status");
        expect(output).toHaveProperty("message");
        // in case of succesful response, expect more data
        if (output.status === "OK") {
          expect(output).toHaveProperty("description", "Login Successfully");
          expect(output).toHaveProperty("data");
          expect(output.data).toHaveProperty("token");
          expect(output.data).toHaveProperty("profile");
          expect(output.data.profile).toHaveProperty("username", "admin");
          expect(output.data.profile).toHaveProperty("email");
          expect(output.data.profile).toHaveProperty("firstName");
          expect(output.data.profile).toHaveProperty("lastName");
          expect(output.data.profile).toHaveProperty("mobilePhone");
          expect(output.data.profile).toHaveProperty("type", "admin");
          expect(output.data.profile).toHaveProperty("operatorId");
          expect(output.data).toHaveProperty("tokenExpiresInSecs");
        }
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
