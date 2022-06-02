const cliProgress = require("cli-progress");
const fs = require("fs");
const csv = require("@fast-csv/parse");
const Scope = require("../Scope");
// import utils file
const { getToken } = require("../utils");

const scopeName = "admin";
const method = "post";

/* Array of all different sets of required parameters, in case there can be more than one set of parameters.
 * Each parameterSet is an object with key-value pairs in the form "parameterName : validValues", where validValues is
 * a regular expression that describes accepted values for each parameterName. If null or undefined, then no values are
 * needed for the specific parameterName.
 */
const scopeParameters = [
  // endpoint: {baseUrl}/admin/usermod/:username/:password
  {
    usermod: undefined, // only used to define the action - does not actually expect any parameters
    username: /[a-zA-Z0-9]+/, // username: alphanumeric
    passw: /\S+/, // password: non-whitespace
  },
  // endpoint: {baseUrl}/admin/users/:username
  {
    users: /[a-zA-Z0-9]+/, // alphanumeric
  },
  // endpoint: {baseUrl}/AddPass
  {
    passesupd: undefined, // only used to define the action - does not actually expect any parameters
    source: /\S+[\.csv]/, // filename: *.csv
  },
];

// Admin endpoint: different for each available set of required parameters
class Admin extends Scope {
  constructor() {
    super(scopeName, scopeParameters); // create a Scope object with this scope's name and parameter sets
  }

  /* insertPasses function: Receives an array of passes (each pass object contains passId,passTime,stationID,vehicleID,charge) and
   * sends POST request to the passed in <endpointUrl>.
   * In case of error, a message will be displayed on the console for each pass.
   * Returns the total number of passes that got successfully imported from the server.
   */
  async insertPasses(endpointUrl, passes) {
    let passesImported = 0, // initialize number of successfully imported passes and
      passesProcessed = 0, // processed passes
      failedPasses = []; // passes that failed to be added on database
    // create a new progress bar instance and use shades_classic theme
    let bar1 = new cliProgress.SingleBar(
      {
        etaBuffer: 50,
      },
      cliProgress.Presets.shades_classic
    );
    // start the progress bar with a total value of passes.length and start value of 0
    bar1.start(passes && passes.length > 0 ? passes.length : 0, 0);

    // get saved token (if any)
    const { token } = getToken();

    for (let pass of passes) {
      // iterate array of passes - make POST request to API to add each of them
      // construct the parameters object for API call
      let apiParameters = {
        body: {
          passID: pass.passID,
          pass_time: new Date(pass.passTime).toISOString(),
          stationID: pass.stationID,
          vehicleID: pass.vehicleID,
          charge: pass.charge,
        },
      };
      // make call to the API
      let result = await this.apiCall(
        endpointUrl,
        apiParameters,
        method,
        token
      );
      // if request succeeded and status is 200 (OK), increment <passesImported> counter
      if (result.status && result.status === 200) {
        // if affected rows > 0, increment number of imported passes
        passesImported++;
      }
      // else add pass to <failedPasses> array
      else {
        failedPasses.push(pass);
        // console.error(
        //   `Insert to database failed for pass ID ${pass.passID}. Server responded with message: ${result.message}`
        // );
      }
      // update the current value of the bar
      bar1.update(++passesProcessed);
    }
    bar1.stop();
    return { passesImported, failedPasses };
  }

  /* passesUpdate function: Receives the path to a csv file in order to read data for passes from it.
   * In case of errror during reading the file, an error message is returned.
   * Otherwise, the read passes array is passed to <insertPasses> function, in order to be inserted to the database.
   */
  async passesUpdate(endpointUrl, csvFile) {
    return new Promise((resolve, reject) => {
      let passes = []; // initialize array of passes in csv file
      try {
        if (fs.existsSync(csvFile)) {
          // check if given <csvFile> exists
          csv
            .parseFile(csvFile, {
              // csv.parseFile configuration - file path: <csvFile>
              headers: true, // enable headers: true
              delimiter: ";", // csv delimiter: ;
              ignoreEmpty: true, // ignore empty rows: true
              // maxRows: 10, // maximum rows to read from csv - ONLY for quick testing
            })
            .on("error", (error) => reject(error)) // if an error occured, show appropriate message
            .on("data", (row) => {
              passes.push(row); // on each successfully parsed row, push read pass into <passes> array
            })
            .on("end", async (rowCount) => {
              // after file reading was finished:
              let { passesImported, failedPasses } = await this.insertPasses(
                endpointUrl,
                passes
              ); // call <insertPasses> to insert to database and get number of imported passes
              resolve({
                PassesInUploadedFile: rowCount,
                PassesImported: passesImported,
                FailedPasses: failedPasses,
              });
            });
        } else {
          // if file <csvFile> does not exist, return appropriate error message
          reject(
            new Error(
              `Specified file ${csvFile} given as --source parameter does not exist.`
            )
          );
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /* function: Run this scope's base function, depending on given <parameters>.
   * First try to <validateParameters>: if provided parameters are invalid, show message to user, otherwise
   * a <parametersObject> is constructed with key-value pairs for each required parameter.
   * Make a call to the API and return the results.
   */
  async run(baseUrl, parameters) {
    const parametersObject = this.validateParameters(parameters);
    // provided parameters are not valid - return error message
    if (!parametersObject) {
      return this.invalidParametersMessage();
    }

    // check which admin action was selected
    // PassesUpdate (--passesupd --source [file.csv])
    if (parametersObject.hasOwnProperty("passesupd")) {
      // construct the endpoint URL string to send the http request to
      let endpointUrl = `${baseUrl}/AddPass`;

      try {
        let result = await this.passesUpdate(
          endpointUrl,
          parametersObject.source
        );
        return JSON.stringify(result);
      } catch (err) {
        return JSON.stringify({ message: err.message });
      }
    }
    // NOTE: ONLY FOR TEST - EITHER IMPLEMENT REST OF ADMIN PARAMETERS OR REMOVE
    else {
      return JSON.stringify(parametersObject);
    }
  }
}

module.exports = Admin;
