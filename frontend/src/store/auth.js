import { createSlice } from "@reduxjs/toolkit";

// helper function: calculate remaining time from given time until current time (in milliseconds)
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

// initial auth data
let initToken = localStorage.getItem("token"); // get saved token from local storage
const initUsername = localStorage.getItem("username"); // get saved username from local storage
const initFirstName = localStorage.getItem("firstName"); // get saved firstName from local storage
const initLastName = localStorage.getItem("lastName"); // get saved lastName from local storage
const initType = localStorage.getItem("type"); // get saved type from local storage (admin, external, operator)
const initOperatorId = localStorage.getItem("operatorId"); // get saved operatorId from local storage (only exists if type=operator)
const initEmail = localStorage.getItem("email"); // get saved email from local storage
const initMobilePhone = localStorage.getItem("mobilePhone"); // get saved mobilePhone from local storage

const initExpirationTime = localStorage.getItem("expirationTime"); // get token's expiration time from local storage
if (initExpirationTime && initToken) {
  // if remaining time until token expiration is less than 1 minute initially, logout the user
  if (calculateRemainingTime(initExpirationTime) <= 60000) {
    initToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  }
}
// either token or expiration time is not saved
else {
  initToken = null;
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
}

const initIsLoggedIn = // initially: isLoggedIn if all initial values are valid & time has not expired
  !!initToken &&
  !!initUsername &&
  !!initFirstName &&
  !!initLastName &&
  !!initType &&
  (initType !== "operator" || !!initOperatorId) &&
  !!initEmail &&
  !!initMobilePhone;

const authInitialState = {
  isLoggedIn: initIsLoggedIn,
  token: initToken,
  expirationTime: initExpirationTime,
  profile: {
    username: initUsername,
    firstName: initFirstName,
    lastName: initLastName,
    type: initType,
    operatorId: initOperatorId,
    email: initEmail,
    mobilePhone: initMobilePhone,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setRemember(state, action) {
      state.remember = action.payload.remember;
    },
    login(state, action) {
      // set token to the token passed on payload
      state.token = action.payload.token;

      // set expirationTime to value passed on payload
      state.expirationTime = action.payload.expirationTime;

      // set profile to the profile passed on payload
      state.profile = action.payload.profile;

      // if <remember> is set to true on current state, save user's token and profile to local storage
      if (state.remember) {
        localStorage.setItem("token", action.payload.token);

        localStorage.setItem("expirationTime", action.payload.expirationTime);

        localStorage.setItem("username", action.payload.profile.username);
        localStorage.setItem("firstName", action.payload.profile.firstName);
        localStorage.setItem("lastName", action.payload.profile.lastName);
        localStorage.setItem("type", action.payload.profile.type);
        if (action.payload.profile.operatorId) {
          localStorage.setItem("operatorId", action.payload.profile.operatorId);
        }
        localStorage.setItem("email", action.payload.profile.email);
        localStorage.setItem("mobilePhone", action.payload.profile.mobilePhone);
      }

      // set isLoggedIn to true
      state.isLoggedIn = true;
    },
    logout(state) {
      // reset token, expirationTime and token
      state.token = null;
      state.expirationTime = null;
      state.profile = null;

      // set isLoggedIn to false
      state.isLoggedIn = false;

      // remove token, expirationTime and all profile data from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("username");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("type");
      localStorage.removeItem("operatorId");
      localStorage.removeItem("email");
      localStorage.removeItem("mobilePhone");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
