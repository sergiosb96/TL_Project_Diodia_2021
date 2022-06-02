import { createSlice } from "@reduxjs/toolkit";

const operatorsInitialState = { operators: [] };

const operatorsSlice = createSlice({
  name: "operators",
  initialState: operatorsInitialState,
  reducers: {
    setOperators(state, action) {
      state.operators = action.payload;
    },
    setStations(state, action) {
      // find operator whose ID matches the given operator's ID, in order to update its stations
      let operatorIndex =
        state.operators.length > 0
          ? state.operators.findIndex((op) => action.payload.opId === op.id)
          : -1;
      // if operator was found:
      if (operatorIndex !== -1) {
        // initialize the array of stations
        state.operators[operatorIndex].stations = [];
        // add all stations given
        for (let station of action.payload.stations) {
          state.operators[operatorIndex].stations.push(station);
        }
      }
    },
    addStation(state, action) {
      // find operator whose ID matches the given operator's ID, in order to update its stations
      let operatorIndex =
        state.operators.length > 0
          ? state.operators.findIndex((op) => action.payload.opId === op.id)
          : -1;
      // if operator was found:
      if (operatorIndex !== -1) {
        // add the station given to operator's stations array
        state.operators[operatorIndex].stations.push(action.payload.station);
      }
    },
  },
});

export const operatorsActions = operatorsSlice.actions;
export default operatorsSlice.reducer;
