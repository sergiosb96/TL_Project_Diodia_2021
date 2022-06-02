const path = require("path");
const fs = require("fs");

const authFileName = path.join(__dirname, ".auth.json");
const initAuthData = {
  token: "",
  expirationDate: "",
};

// create and initialize initial auth file
const initializeAuthFile = () => {
  fs.writeFileSync(authFileName, JSON.stringify(initAuthData));
};

// returns the currently saved token and its expiration date
const getToken = () => {
  // check if file exists
  if (!fs.existsSync(authFileName)) {
    // if the file does not exist, create with empty data
    initializeAuthFile();
    return initAuthData;
  }
  let authData = fs.readFileSync(authFileName);
  try {
    let auth = JSON.parse(authData);
    if (auth && auth.token && auth.expirationDate) return auth;
    initializeAuthFile();
    return initAuthData;
  } catch (e) {
    // if error occured (incorrect file format), re-initialize the file
    initializeAuthFile();
    return initAuthData;
  }
};

// saves a token and expiration file to auth file
const saveToken = (token, expirationDate) => {
  fs.writeFileSync(authFileName, JSON.stringify({ token, expirationDate }));
};

// helper function: calculate remaining time from given time until current time (in milliseconds)
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  // if given expiration time is valid, return the remaining time from current time
  if (!isNaN(adjExpirationTime)) {
    return adjExpirationTime - currentTime;
  }
  return null;
};

module.exports = {
  authFileName,
  initializeAuthFile,
  getToken,
  saveToken,
  calculateRemainingTime,
};
