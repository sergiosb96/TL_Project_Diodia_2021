const spawn = require("child_process").spawn;

describe("PassesPerStation functional testing", () => {
  // Test passesperstation call with invalid parameters (or no parameters)
  test("PassesPerStation test - invalid parameters", (done) => {
    const main = spawn("se2188", ["passesperstation", "--station", "AO00"], {
      shell: true,
    });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      const output = Buffer.concat(tempOutput).toString();
      try {
        expect(output).toEqual(`Invalid parameters for scope passesperstation.
The parameters that are required for this scope are:
passesperstation --station [value] --datefrom [value] --dateto [value] --format [value]
`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test passesperstation call with valid but incorrect parameters (eg non-existing station)
  test("PassesPerStation test - valid but incorrect parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "passesperstation",
        "--station",
        "AO50",
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

  // Test passesperstation call with valid and correct parameters (JSON format)
  test("PassesPerStation test - valid and correct parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "passesperstation",
        "--station",
        "AO00",
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
          expect(output).toHaveProperty("description", "passesPerStation");
          expect(output).toHaveProperty("data");
          expect(output.data).toHaveProperty("Station", "AO00");
          expect(output.data).toHaveProperty("StationOperator", "aodos");
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
