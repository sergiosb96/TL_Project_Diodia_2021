const spawn = require("child_process").spawn;
const path = require("path");

describe("Admin functional testing", () => {
  // Test admin call with invalid parameters (or no parameters)
  test("Admin test - invalid parameters", (done) => {
    const main = spawn("se2188", ["admin"], {
      shell: true,
    });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      const output = Buffer.concat(tempOutput).toString();
      try {
        expect(output).toEqual(`Invalid parameters for scope admin.
The parameters that are required for this scope are:
admin --usermod --username [value] --passw [value]
admin --users [value]
admin --passesupd --source [value]
`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test admin call with valid but incorrect parameters (non-existing csv file)
  test("Admin test - valid but incorrect parameters", (done) => {
    const main = spawn(
      "se2188",
      ["admin", "--passesupd", "--source", "does-not-exist.csv"],
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
        expect(output).toHaveProperty(
          "message",
          "Specified file does-not-exist.csv given as --source parameter does not exist."
        );
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test admin call with valid and correct parameters (for passesupd function)
  test("Admin test - passes update with valid and correct parameters", (done) => {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "database",
      "csv",
      "100-passes-test.csv"
    );
    const main = spawn(
      "se2188",
      ["admin", "--passesupd", "--source", filePath],
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
        // performed test is on a known csv file with 10 passes
        expect(output).toHaveProperty("PassesInUploadedFile", 100);
        expect(output).toHaveProperty("PassesImported");
        expect(output).toHaveProperty("FailedPasses");
        expect(output.FailedPasses.length).toBe(
          output.PassesInUploadedFile - output.PassesImported
        );
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test admin call with valid and correct parameters (for usermod function)
  test("Admin test - usermod with valid and correct parameters", (done) => {
    const main = spawn(
      "se2188",
      ["admin", "--usermod", "--username", "test", "--passw", "qwerty"],
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
        // usermod is not implemented - expect returned object to have the passed parameters
        expect(output).toHaveProperty("usermod", true);
        expect(output).toHaveProperty("username", "test");
        expect(output).toHaveProperty("passw", "qwerty");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test admin call with valid and correct parameters (for users)
  test("Admin test - usermod with valid and correct parameters", (done) => {
    const main = spawn("se2188", ["admin", "--users", "test"], { shell: true });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      // convert JSON output to an object
      const output = JSON.parse(Buffer.concat(tempOutput).toString());
      try {
        // users is not implemented - expect returned object to have the passed parameters
        expect(output).toHaveProperty("users", "test");
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
