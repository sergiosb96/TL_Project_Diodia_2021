#!/usr/bin/env node
// yargs - used for easy parsing of command line arguments
const argv = require("yargs/yargs")(process.argv.slice(2)).argv;

// import all available scopes
const scopes = require("../src/AllScopes");

// import utils file
const {
  initializeAuthFile,
  getToken,
  calculateRemainingTime,
} = require("../src/utils");

// get the saved token and its expiration date
const { token, expirationDate } = getToken();
// if there is a saved token
if (token && token !== "") {
  // check if remaining time until token expiration is less than 1 minute initially - if true, initialize the auth file
  if (!expirationDate || calculateRemainingTime(expirationDate) <= 60000) {
    initializeAuthFile();
  }
}

// API base url
// const baseUrl = "http://83.212.102.64:9103/interoperability/api";
const baseUrl = "http://localhost:9103/interoperability/api";

// Function: Print all scopes
const noParametersMessage = () => {
  return `Supported commands follow the format: se2188 scope --param1 value1 [--param2 value2 ...] --format fff
where available values for the --format parameter are either 'json' or 'csv'.
Below are the available scopes and their respective parameters:
${scopes
  .map((scope) => {
    return scope.toString();
  })
  .join("\n")}`;
};

/* Check for passed scope (command) in command line arguments (Note: exactly one scope has to be passed as parameter)
 * returns { status, scope } where status is:
 * - 0 = valid scope (returned scope is the found scope)
 * - 1 = Invalid scope name (returned scope is the given scope's name)
 * - 2 = More than one scopes passed
 * - 3 = No scopes passed,
 */
const checkArguments = (argumentsArray) => {
  // No scopes passed
  if (!argumentsArray || argumentsArray.length === 0) {
    return { status: 3, scope: undefined };
  }
  // More than one scopes passed : Show error message
  else if (argumentsArray.length > 1) {
    return { status: 2, scope: undefined };
  }
  // Exactly one scope was passed as parameter : Check if scope's name is valid
  else {
    const scopeName = argumentsArray[0]; // read given scope's name
    const scope = scopes.find((scope) => scope.getName() === scopeName); // find the selected scope in scopes array

    // invalid scope - does not exist in scopes array
    if (!scope) {
      return { status: 1, scope: scopeName };
    }
    // scope was found - call its <run> function
    else {
      return { status: 0, scope };
    }
  }
};

const { status, scope } = checkArguments(argv._);

switch (status) {
  // scope was found - call its <run> function
  case 0:
    scope.run(baseUrl, argv).then((response) => console.log(response));
    break;
  // invalid scope - print message
  case 1:
    console.log(
      `The requested scope '${scope}' does not exist. Execute the command se2188 to see the available scopes and their respective parameters.`
    );
    break;
  // More than one scopes passed : Show error message
  case 2:
    console.log(
      "Only one scope can be executed per command. Execute the command se2188 to see the available scopes and their respective parameters."
    );
    break;
  // No scopes passed : print message and all available scopes
  case 3:
    console.log(noParametersMessage());
    break;
  // default case - should never be called
  default:
    console.log("Something went wrong. Please try again");
}

module.exports = { noParametersMessage, checkArguments };
