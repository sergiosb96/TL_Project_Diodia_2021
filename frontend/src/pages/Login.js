import React from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";

import { authActions } from "../store/auth";
import useHttp from "../hooks/use-http";

import FormLogin from "../components/Forms/FormLogin";
import UserProfile from "../components/UserProfile/UserProfile";

const Login = (props) => {
  // base URL for API requests
  const baseUrl = props.baseUrl;
  const dispatch = useDispatch(); // dispatch actions to store

  // get current authentication state from store
  const { isLoggedIn, expirationTime, profile } = useSelector(
    (state) => state.auth
  );

  // custom hook to make http requests
  const { isLoading, error, sendRequest } = useHttp();

  // transform API response to data object (used as callback for useHttp hook)
  const transformData = (dataResponse) => {
    let dataObj = dataResponse.data;
    // get token from response object
    let token = dataObj.token;
    // get expiration time (in seconds) from response object
    let expiresIn = +dataObj.tokenExpiresInSecs;
    let expirationTime = new Date(new Date().getTime() + expiresIn * 1000);
    // get profile data from response
    let profile = dataObj.profile;

    // set login data to global auth state, by calling the login action
    dispatch(
      authActions.login({
        token,
        expirationTime: expirationTime.toISOString(),
        profile,
      })
    );
  };

  // make POST request to API to try to Login - {baseUrl}/login
  const submitHandler = async (username, password, remember) => {
    // set remember to true or false (depending on form selection) on global auth state
    dispatch(authActions.setRemember({ remember }));

    let url = `${baseUrl}/login`; // construct API endpoint URL

    sendRequest(
      {
        url,
        method: "POST",
        data: qs.stringify({
          username,
          password,
        }),
      },
      transformData
    );
  };

  return (
    <div className="w-100 h-100 mx-auto pt-2 pb-3 px-5">
      <h1 className="mb-5">{isLoggedIn ? "Προφίλ" : "Είσοδος Χρήστη"}</h1>
      <div className="m-auto">
        {!isLoggedIn && (
          <FormLogin onSubmit={submitHandler} isLoading={isLoading} />
        )}
        {isLoggedIn && (
          <UserProfile user={profile} expirationTime={expirationTime} />
        )}
      </div>
      {!isLoading && error && (
        <p className="text-danger">Προέκυψε κάποιο σφάλμα: {error}</p>
      )}
    </div>
  );
};

export default Login;
