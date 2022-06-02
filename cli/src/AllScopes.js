// import all available scopes from /Scopes folder
const Healthcheck = require("./Scopes/Healthcheck");
const ResetPasses = require("./Scopes/ResetPasses");
const ResetStations = require("./Scopes/ResetStations");
const ResetVehicles = require("./Scopes/ResetVehicles");
const Login = require("./Scopes/Login");
const Logout = require("./Scopes/Logout");
const PassesPerStation = require("./Scopes/PassesPerStation");
const PassesAnalysis = require("./Scopes/PassesAnalysis");
const PassesCost = require("./Scopes/PassesCost");
const ChargesBy = require("./Scopes/ChargesBy");
const Admin = require("./Scopes/Admin");

// define all available scopes
const scopes = [
  new Healthcheck(),
  new ResetPasses(),
  new ResetStations(),
  new ResetVehicles(),
  new Login(),
  new Logout(),
  new PassesPerStation(),
  new PassesAnalysis(),
  new PassesCost(),
  new ChargesBy(),
  new Admin(),
];

module.exports = scopes;
