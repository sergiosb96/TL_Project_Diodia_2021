const config = require("./jest.config");

config.testRegex = "/unit/(.*|(\\.|/)(test|spec))\\.[jt]sx?$";

module.exports = config;
