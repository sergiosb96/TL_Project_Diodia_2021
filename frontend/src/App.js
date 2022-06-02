import React, { Fragment, useEffect, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { operatorsActions } from "./store/operators";
import { authActions } from "./store/auth";

import useHttp from "./hooks/use-http";

import MainNavigation from "./components/Layout/MainNavigation";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const Login = React.lazy(() => import("./pages/Login"));
const Statistics = React.lazy(() => import("./pages/Statistics"));
const PassesPerStation = React.lazy(() => import("./pages/PassesPerStation"));
const PassesAnalysis = React.lazy(() => import("./pages/PassesAnalysis"));
const PassesCost = React.lazy(() => import("./pages/PassesCost"));
const ChargesBy = React.lazy(() => import("./pages/ChargesBy"));
const BalanceAnalysis = React.lazy(() => import("./pages/BalanceAnalysis"));

// API base url
// const baseUrl = "http://83.212.102.64:9103/interoperability/api";
const baseUrl = "http://localhost:9103/interoperability/api";

let autoLogoutTimer; // Timer: Automatically logout user after the token has expired

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

function App() {
  const dispatch = useDispatch();

  // custom hook to make http requests
  const { sendRequest } = useHttp();

  // on initial load of the page - get all operators and stations from API
  useEffect(() => {
    let unmounted = false;

    // transform API response on GetStations to data object (used as callback for useHttp hook)
    const transformStationsData = (dataResponse) => {
      let dataObj = dataResponse.data;

      // for each station in response
      for (let station of dataObj.stations) {
        // add to store, using the operator's ID and stations information
        dispatch(
          operatorsActions.addStation({
            opId: station.stationProvider,
            station: { id: station.stationID, name: station.stationName },
          })
        );
      }
    };

    // transform API response on GetOperators to data object (used as callback for useHttp hook)
    const transformOperatorsData = (dataResponse) => {
      let dataObj = dataResponse.data;
      let loadedOperatorsData = [];

      // move data from response <dataObj> to <loadedOperatorsData>
      for (let operator of dataObj.operators) {
        loadedOperatorsData.push({
          id: operator.opID,
          name: operator.opName,
          abbr: operator.opAbbr,
          stations: [],
        });
      }
      // add all operators from response to the store
      dispatch(operatorsActions.setOperators(loadedOperatorsData));

      // make GET request to API to GetStations - {baseUrl}/getstations
      let url = `${baseUrl}/getstations`;
      sendRequest(
        {
          url,
        },
        transformStationsData
      );
    };

    if (!unmounted) {
      // make GET request to API to GetOperators - {baseUrl}/getoperators
      let url = `${baseUrl}/getoperators`;
      sendRequest(
        {
          url,
        },
        transformOperatorsData
      );
    }

    // clean-up function
    return () => {
      unmounted = true;
    };
  }, [sendRequest, dispatch]);

  // get current authentication state from store
  const { isLoggedIn, expirationTime, profile } = useSelector(
    (state) => state.auth
  );
  const isAdmin = isLoggedIn && profile.type === "admin";
  const isOperator = isLoggedIn && profile.type === "operator";

  // auto logout timer
  useEffect(() => {
    // calculate remaining time (in milliseconds) until expiration time
    const remainingTime = calculateRemainingTime(expirationTime);
    // if user is logged in and expiration time is set and valid:
    if (isLoggedIn && expirationTime && remainingTime) {
      // if there was a previously running timer, clear it
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
      // set timer to automatically logout user after remaining time
      autoLogoutTimer = setTimeout(
        () => dispatch(authActions.logout()),
        remainingTime
      );
    }
    // if user is not logged in or expiration time is invalid, reset the running timer (if any)
    else {
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
    }
  }, [isLoggedIn, expirationTime, dispatch]);

  return (
    <Fragment>
      {/* main navigation top-bar */}
      <MainNavigation />
      <Container fluid className="text-center m-0 p-0">
        {/* router */}
        <Suspense
          fallback={
            <div>
              <LoadingSpinner />
            </div>
          }
        >
          <Switch>
            <Route path="/" exact>
              <Login baseUrl={baseUrl} />
            </Route>
            {/* if user is not logged in, redirect to login page */}
            {!isLoggedIn && (
              <Route path="*">
                <Redirect to="/" />
              </Route>
            )}
            <Route path="/statistics" exact>
              <Statistics baseUrl={baseUrl} />
            </Route>
            {/* user logged in as external (eg transportation authorities) only has access to statistics page - redirect all other pages */}
            {isLoggedIn && !isAdmin && !isOperator && (
              <Route path="*">
                <Redirect to="/" />
              </Route>
            )}
            {/* administrator and operators have access to all pages */}
            <Route path="/passes-per-station" exact>
              <PassesPerStation baseUrl={baseUrl} />
            </Route>
            <Route path="/passes-analysis" exact>
              <PassesAnalysis baseUrl={baseUrl} />
            </Route>
            <Route path="/passes-cost" exact>
              <PassesCost baseUrl={baseUrl} />
            </Route>
            <Route path="/charges-by" exact>
              <ChargesBy baseUrl={baseUrl} />
            </Route>
            <Route path="/balance-analysis" exact>
              <BalanceAnalysis baseUrl={baseUrl} />
            </Route>
            <Route path="/statistics" exact>
              <Statistics baseUrl={baseUrl} />
            </Route>
            {(isAdmin || isOperator) && (
              <Route path="*">
                <Redirect to="/" />
              </Route>
            )}
          </Switch>
        </Suspense>
      </Container>
    </Fragment>
  );
}

export default App;
