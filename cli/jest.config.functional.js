const config = require("./jest.config");

config.testRegex = "/functional/(.*|(\\.|/)(test|spec))\\.[jt]sx?$";
config.testTimeout = 30000;

module.exports = config;
