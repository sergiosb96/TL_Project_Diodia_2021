const spawn = require("child_process").spawn;

describe("Logout functional testing", () => {
  test("Logout test", (done) => {
    const main = spawn("se2188", ["logout"], { shell: true });

    const tempOutput = [];
    main.stdout.on("data", (data) => {
      tempOutput.push(data);
    });

    main.stdout.on("end", () => {
      let output = Buffer.concat(tempOutput).toString();
      let isJSON = false;
      // if user was logged in, server's response is in JSON
      try {
        // convert JSON output to an object
        output = JSON.parse(output);
        isJSON = true;
      } catch (e) {
        // otherwise a message is shown letting user know he is not logged in
        isJSON = false;
      }
      // user was logged in
      if (isJSON) {
        try {
          expect(output).toHaveProperty("status");
          expect(output).toHaveProperty("message");
          if (output.status === "OK") {
            expect(output).toHaveProperty("description", "Logout Successfully");
          }
          done();
        } catch (e) {
          done(e);
        }
      }
      // user was not logged in
      else {
        try {
          expect(output).toEqual(`You are not logged in
`);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });
});
