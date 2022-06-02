import {DbManager} from "./dbManager";

// This function returns all station by an operator id
export const getAllStations = async (opID: string): Promise<string[]> => {
    const allStationsRows = await DbManager.getInstance()
        .query("SELECT stationID FROM Stations WHERE stationProvider = (?)", [opID]);
    if (allStationsRows && allStationsRows.length > 0) {
        return allStationsRows.map((station: { [x: string]: any; }) => station['stationID']);
    } else {
        return []
    }
};


// This function returns all stations
export const getAllSystemStations = async (): Promise<object[]> => {
    const allStationsRows = await DbManager.getInstance()
        .query("SELECT * FROM Stations", []);
    if (allStationsRows && allStationsRows.length > 0) {
        return allStationsRows;
    } else {
        return []
    }
};
// This function returns stations by an operator id
export const getSystemStationsByOpID = async (opID: string): Promise<object[]> => {
    const allStationsRows = await DbManager.getInstance()
        .query("SELECT * FROM Stations WHERE stationProvider = (?)", [opID]);
    return allStationsRows && allStationsRows.length > 0 ? allStationsRows : [];
};

// This function checks if exist pass with same vehicle id and pass time
export const existPassWithSameVehicleIdAndPassTime = async (vehicleId: string, passTime: Date): Promise<boolean> => {
    const results = await DbManager.getInstance()
        .query("SELECT passID FROM Pass WHERE VehicleID = (?) AND passTime = (?)", [vehicleId, passTime]);

    return results && results.length > 0;
};
// This function returns a user by his username from database
export const getUser = async (username: string): Promise<any> => {
    const results = await DbManager.getInstance()
        .query("SELECT * FROM Users WHERE username = (?)", [username]);

    return results && results.length > 0 ? results[0] : null;
};

// This function returns all operators
export const getAllSystemOperators = async (): Promise<string[]> => {
    const allOperators = await DbManager.getInstance()
        .query("SELECT * FROM Operators", []);
    return allOperators ?? [];
};
