const spawn = require("child_process").spawn;

describe("PassesAnalysis functional testing", () => {
  // Test passesanalysis call with invalid parameters (or no parameters)
  test("PassesAnalysis test - invalid parameters", (done) => {
    const main = spawn("se2188", ["passesanalysis", "--op1", "aodos"], {
      shell: true,
    });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      const output = Buffer.concat(tempOutput).toString();
      try {
        expect(output).toEqual(`Invalid parameters for scope passesanalysis.
The parameters that are required for this scope are:
passesanalysis --op1 [value] --op2 [value] --datefrom [value] --dateto [value] --format [value]
`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test passesanalysis call with valid but incorrect parameters (eg non-existing operator)
  test("PassesAnalysis test - valid but incorrect parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "passesanalysis",
        "--op1",
        "ntua_odos",
        "--op2",
        "kentriki_odos",
        "--datefrom",
        "20200101",
        "--dateto",
        "20200101",
        "--format",
        "json",
      ],
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

  // Test passesanalysis call with valid and correct parameters (JSON format)
  test("PassesAnalysis test - valid and correct parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "passesanalysis",
        "--op1",
        "aodos",
        "--op2",
        "kentriki_odos",
        "--datefrom",
        "20200101",
        "--dateto",
        "20200101",
        "--format",
        "json",
      ],
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
          expect(output).toHaveProperty("description", "passesAnalysis");
          expect(output).toHaveProperty("data");
          expect(output.data).toHaveProperty("op1_ID", "aodos");
          expect(output.data).toHaveProperty("op2_ID", "kentriki_odos");
          expect(output.data).toHaveProperty("RequestTimestamp");
          expect(output.data).toHaveProperty(
            "PeriodFrom",
            "2020-01-01T00:00:00.000Z"
          );
          expect(output.data).toHaveProperty(
            "PeriodTo",
            "2020-01-01T00:00:00.000Z"
          );
          expect(output.data).toHaveProperty("NumberOfPasses");
          expect(output.data).toHaveProperty("PassesList");
          expect(output.data.PassesList.length).toBe(
            output.data.NumberOfPasses
          );
        }
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
