const { noParametersMessage, checkArguments } = require("../../cli/bin/index");

// Unit tests for index module (responsible for reading command line arguments and calling the selected scope with given parameters)
describe("index module unit testing", () => {
  // noParametersMessage method - should print a message and all available scopes
  test("noParametersMessage() method - print all available scopes", () => {
    const result = noParametersMessage();
    expect(result)
      .toBe(`Supported commands follow the format: se2188 scope --param1 value1 [--param2 value2 ...] --format fff
where available values for the --format parameter are either 'json' or 'csv'.
Below are the available scopes and their respective parameters:
healthcheck (no parameters needed)
resetpasses (no parameters needed)
resetstations (no parameters needed)
resetvehicles (no parameters needed)
login --username [value] --passw [value]
logout (no parameters needed)
passesperstation --station [value] --datefrom [value] --dateto [value] --format [value]
passesanalysis --op1 [value] --op2 [value] --datefrom [value] --dateto [value] --format [value]
passescost --op1 [value] --op2 [value] --datefrom [value] --dateto [value] --format [value]
chargesby --op1 [value] --datefrom [value] --dateto [value] --format [value]
admin --usermod --username [value] --passw [value]
admin --users [value]
admin --passesupd --source [value]`);
  });

  // checkArguments method - no passed scopes
  test("checkArguments() method - no scopes passed from CLI", () => {
    let result = checkArguments();
    expect(result).toEqual({ status: 3, scope: undefined });

    result = checkArguments([]);
    expect(result).toEqual({ status: 3, scope: undefined });
  });

  // checkArguments method - more than one scopes passed as arguments
  test("checkArguments() method - more than one scopes passed as arguments from CLI", () => {
    const result = checkArguments(["scope1", "scope2"]);
    expect(result).toEqual({ status: 2, scope: undefined });
  });

  // checkArguments method - invalid scope passed as argument
  test("checkArguments() method - invalid scope passed as argument from CLI", () => {
    const result = checkArguments(["scope1"]);
    expect(result).toEqual({ status: 1, scope: "scope1" });
  });

  // checkArguments method - valid scope passed as argument
  test("checkArguments() method - valid scope passed as argument from CLI", () => {
    let result = checkArguments(["admin"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("admin");

    result = checkArguments(["chargesby"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("chargesby");

    result = checkArguments(["healthcheck"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("healthcheck");

    result = checkArguments(["login"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("login");

    result = checkArguments(["logout"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("logout");

    result = checkArguments(["passesanalysis"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("passesanalysis");

    result = checkArguments(["passescost"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("passescost");

    result = checkArguments(["passesperstation"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("passesperstation");

    result = checkArguments(["resetpasses"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("resetpasses");

    result = checkArguments(["resetstations"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("resetstations");

    result = checkArguments(["resetvehicles"]);
    expect(result.status).toBe(0);
    expect(result.scope.getName()).toBe("resetvehicles");
  });
});
