const spawn = require("child_process").spawn;

describe("ResetPasses functional testing", () => {
  test("ResetPasses test", (done) => {
    const main = spawn("se2188", ["resetpasses"], { shell: true });

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
            "Reset Pass successfully"
          );
        }
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
