const spawn = require("child_process").spawn;

describe("Healthcheck functional testing", () => {
  test("Healthcheck test", (done) => {
    const main = spawn("se2188", ["healthcheck"], { shell: true });

    const tempOutput = [];

    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stderr.on("data", (data) => {
      console.log(data);
    });

    main.stdout.on("end", () => {
      // convert JSON output to an object
      const output = JSON.parse(Buffer.concat(tempOutput).toString());
      expect(output).toHaveProperty("status");
      expect(output).toHaveProperty("message");
      //  expect(output).toHaveProperty("description"); (removed because it doesn't exist in error responses)
      done();
    });
  });
});
