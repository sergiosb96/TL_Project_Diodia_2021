const spawn = require("child_process").spawn;

describe("ChargesBy functional testing", () => {
  // Test chargesby call with invalid parameters (or no parameters)
  test("ChargesBy test - invalid parameters", (done) => {
    const main = spawn("se2188", ["chargesby", "--op1", "aodos"], {
      shell: true,
    });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      const output = Buffer.concat(tempOutput).toString();
      try {
        expect(output).toEqual(`Invalid parameters for scope chargesby.
The parameters that are required for this scope are:
chargesby --op1 [value] --datefrom [value] --dateto [value] --format [value]
`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // Test chargesby call with valid but incorrect parameters (eg non-existing operator)
  test("ChargesBy test - valid but incorrect parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "chargesby",
        "--op1",
        "ntua_odos",
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

  // Test chargesby call with valid and correct parameters (JSON format)
  test("ChargesBy test - valid and correct parameters", (done) => {
    const main = spawn(
      "se2188",
      [
        "chargesby",
        "--op1",
        "aodos",
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
          expect(output).toHaveProperty("description", "chargesBy");
          expect(output).toHaveProperty("data");
          expect(output.data).toHaveProperty("op_ID", "aodos");
          expect(output.data).toHaveProperty("RequestTimestamp");
          expect(output.data).toHaveProperty(
            "PeriodFrom",
            "2020-01-01T00:00:00.000Z"
          );
          expect(output.data).toHaveProperty(
            "PeriodTo",
            "2020-01-01T00:00:00.000Z"
          );
          expect(output.data).toHaveProperty("PPOList");
        }
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
