const spawn = require("child_process").spawn;

describe("ResetVehicles functional testing", () => {
  test("ResetVehicles test", (done) => {
    const main = spawn("se2188", ["resetvehicles"], { shell: true });

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
        if (output.status === "OK") {
          expect(output).toHaveProperty(
            "description",
            "Reset Vehicles successfully"
          );
        }
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
