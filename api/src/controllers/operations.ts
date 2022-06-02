import {NextFunction, Request, Response} from "express";
import {getResponseBodyFormat, ResponseStatus, RestResponse} from "../utils/restResponse";
import {DbManager} from "../database/dbManager";
import {v4 as uuid} from 'uuid';
import {
    existPassWithSameVehicleIdAndPassTime,
    getAllStations,
    getAllSystemOperators,
    getAllSystemStations,
    getSystemStationsByOpID
} from "../database/helper";
import {getDateFromParams} from "../utils/time";
import {getSessionMessage} from "../auth/utils";

/***
 * This function returns the passes per station
 * @param req
 * @param res
 * @param next
 */
const passesPerStation = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const stationID = req.params['stationID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);
    if (stationID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const stationOperationRows = await DbManager.getInstance().query("SELECT stationProvider FROM Stations WHERE stationID = (?)", [stationID]);

            if (stationOperationRows && stationOperationRows.length > 0) {
                const stationOperator = stationOperationRows[0]['stationProvider'];
                let queryBuilder = "SELECT passID, passTime, stationID, Pass.vehicleID, charge, tagID, tagProvider "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.stationID = (?) AND Pass.passTime >= (?) AND Pass.passTime <= (?) "
                queryBuilder += "ORDER BY Pass.passTime";

                const rows: [] = await DbManager.getInstance().query(queryBuilder, [stationID, dateFrom, dateTo]);
                const passesList = [];
                let index = 0;
                for (const row of rows) {
                    passesList.push({
                        PassIndex: ++index,
                        PassID: row['passID'],
                        PassTimeStamp: row['passTime'] ? new Date(row['passTime']).toISOString() : null,
                        VehicleID: row['vehicleID'],
                        TagProvider: row['tagProvider'],
                        PassType: row['tagProvider'] == stationOperator ? "home" : "visitor",
                        PassCharge: row['charge']
                    })
                }

                return RestResponse.success(res, {
                    authInfo: getSessionMessage(req),
                    description: "passesPerStation", body: {
                        Station: stationID,
                        StationOperator: stationOperator,
                        RequestTimestamp: new Date().toISOString(),
                        PeriodFrom: dateFrom.toISOString(),
                        PeriodTo: dateTo.toISOString(),
                        NumberOfPasses: rows.length,
                        PassesList: passesList
                    }, format
                });
            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }

    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
};

/***
 * This function returns the passes analysis
 * @param req
 * @param res
 * @param next
 */
const passesAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const op1ID = req.params['op1_ID'];
    const op2ID = req.params['op2_ID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);

    if (op1ID && op2ID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const allStations: string[] = await getAllStations(op1ID);

            if (allStations.length > 0) {
                let queryBuilder = "SELECT passID, passTime, stationID, Pass.vehicleID, charge, tagID, tagProvider "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.passTime >= (?) AND Pass.passTime <= (?) AND Pass.stationID IN (?) "
                queryBuilder += "AND Vehicles.tagProvider = (?) ORDER BY Pass.passTime";

                const rows: [] = await DbManager.getInstance().query(queryBuilder, [dateFrom, dateTo, allStations, op2ID]);
                const passesList = [];
                let index = 0;
                for (const row of rows) {
                    passesList.push({
                        PassIndex: ++index,
                        PassID: row['passID'],
                        StationID: row['stationID'],
                        TimeStamp: row['passTime'] ? new Date(row['passTime']).toISOString() : null,
                        VehicleID: row['vehicleID'],
                        Charge: row['charge']
                    })
                }

                return RestResponse.success(res, {
                    authInfo: getSessionMessage(req),
                    description: "passesAnalysis", body: {
                        op1_ID: op1ID,
                        op2_ID: op2ID,
                        RequestTimestamp: new Date().toISOString(),
                        PeriodFrom: dateFrom.toISOString(),
                        PeriodTo: dateTo.toISOString(),
                        NumberOfPasses: rows.length,
                        PassesList: passesList
                    }, format
                });
            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
};

/***
 * This function returns the passes cost
 * @param req
 * @param res
 * @param next
 */
const passesCost = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const op1ID = req.params['op1_ID'];
    const op2ID = req.params['op2_ID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);

    if (op1ID && op2ID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const allStations: string[] = await getAllStations(op1ID);

            if (allStations.length > 0) {
                let queryBuilder = "SELECT COUNT(*) as length, SUM(charge) as passesCost "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.passTime >= (?) AND Pass.passTime <= (?) AND Pass.stationID IN (?) "
                queryBuilder += "AND Vehicles.tagProvider = (?)";

                const rows: [] = await DbManager.getInstance().query(queryBuilder, [dateFrom, dateTo, allStations, op2ID]);
                if (rows && rows.length > 0) {
                    const result = rows.pop();
                    const length = result!['length'] ?? 0;
                    const passesCost = result!['passesCost'] ?? 0;
                    return RestResponse.success(res, {
                        authInfo: getSessionMessage(req),
                        description: "passesCost", body: {
                            op1_ID: op1ID,
                            op2_ID: op2ID,
                            RequestTimestamp: new Date().toISOString(),
                            PeriodFrom: dateFrom.toISOString(),
                            PeriodTo: dateTo.toISOString(),
                            NumberOfPasses: length,
                            PassesCost: passesCost
                        }, format
                    });
                } else {
                    return RestResponse.fail(res, ResponseStatus.NO_DATA);
                }
            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
};


/***
 * This function charges
 * @param req
 * @param res
 * @param next
 */
const chargesBy = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const opID = req.params['op_ID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);

    if (opID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const allStations: string[] = await getAllStations(opID);

            if (allStations.length > 0) {
                let queryBuilder = "SELECT Vehicles.tagProvider as visitingOperator, COUNT(*) as numberOfPasses, SUM(charge) as passesCost "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.passTime >= (?) AND Pass.passTime <= (?) AND Pass.stationID IN (?) "
                queryBuilder += "AND Vehicles.tagProvider <> (?) GROUP BY Vehicles.tagProvider";
                const rows: [] = await DbManager.getInstance().query(queryBuilder, [dateFrom, dateTo, allStations, opID]);
                return RestResponse.success(res, {
                    authInfo: getSessionMessage(req),
                    description: "chargesBy", body: {
                        op_ID: opID,
                        RequestTimestamp: new Date().toISOString(),
                        PeriodFrom: dateFrom.toISOString(),
                        PeriodTo: dateTo.toISOString(),
                        PPOList: rows.map((row) => {
                            return {
                                VisitingOperator: row['visitingOperator'],
                                NumberOfPasses: row['numberOfPasses'],
                                PassesCost: row['passesCost']
                            }
                        })
                    }, format
                });
            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
};

/***
 * This function add a new pass
 * @param req
 * @param res
 * @param next
 */
const addPass = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const stationID = req.body['stationID'];
    const vehicleID = req.body['vehicleID'];
    const passTimeStr = req.body['pass_time'];
    const charge = req.body['charge'];

    if (stationID && vehicleID && passTimeStr && charge) {
        const passTime: Date = new Date(passTimeStr) ?? new Date();
        if (!isNaN(passTime.getTime())) {

            if (await existPassWithSameVehicleIdAndPassTime(vehicleID, passTime)) {
                return RestResponse.fail(res, ResponseStatus.BAD_REQUEST, 'The pass already exists');
            } else {
                return DbManager.getInstance()
                    .query("INSERT INTO Pass (passID, stationID,vehicleID,passTime,charge) VALUES (?, ?,?,?,?)",
                        [uuid(), stationID, vehicleID, passTime, charge])
                    .then((value) => RestResponse.success(res, {
                        authInfo: getSessionMessage(req),
                        description: "addPass", format
                    })).catch(() => RestResponse.fail(res, ResponseStatus.SERVER_ERROR));
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
};
/***
 * This function returns statistics
 * @param req
 * @param res
 * @param next
 */
const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const opID = req.params['op_ID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);

    if (opID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const allStations: string[] = await getAllStations(opID);
            if (allStations.length > 0) {
                let queryBuilder = "SELECT Pass.stationID as station, COUNT(*) as numberOfPasses, SUM(charge) as passesCost "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.passTime >= (?) AND Pass.passTime <= (?) AND Pass.stationID IN (?) "
                queryBuilder += "AND Vehicles.tagProvider = (?) GROUP BY Pass.stationID";
                const rows: [] = await DbManager.getInstance().query(queryBuilder, [dateFrom, dateTo, allStations, opID]);
                return RestResponse.success(res, {
                    authInfo: getSessionMessage(req),
                    description: "getStatistics", body: {
                        op_ID: opID,
                        RequestTimestamp: new Date().toISOString(),
                        PeriodFrom: dateFrom.toISOString(),
                        PeriodTo: dateTo.toISOString(),
                        StationList: rows.map((row) => {
                            return {
                                Station: row['station'],
                                NumberOfPasses: row['numberOfPasses'],
                                PassesCost: row['passesCost']
                            }
                        })
                    }, format
                });

            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
}

/***
 * This function returns a balance analysis
 * @param req
 * @param res
 * @param next
 */
const balanceAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const op1ID = req.params['op1_ID'];
    const op2ID = req.params['op2_ID'];
    const dateFrom = getDateFromParams(req.params['date_from']);
    const dateTo = getDateFromParams(req.params['date_to']);

    if (op1ID && op2ID && dateFrom && dateTo) {
        if (!isNaN(dateFrom.getTime()) && !isNaN(dateTo.getTime())) {
            const allStationsOp1: string[] = await getAllStations(op1ID);
            const allStationsOp2: string[] = await getAllStations(op2ID);

            if (allStationsOp1.length > 0 || allStationsOp2.length > 0) {
                let queryBuilder = "SELECT COUNT(*) as length, SUM(charge) as passesCost "
                queryBuilder += "FROM Pass INNER JOIN Vehicles ON Pass.vehicleID = Vehicles.VehicleID "
                queryBuilder += "WHERE Pass.passTime >= (?) AND Pass.passTime <= (?) AND Pass.stationID IN (?) "
                queryBuilder += "AND Vehicles.tagProvider = (?)";

                const rowsOp1: [] = allStationsOp1.length > 0 ? await DbManager.getInstance()
                    .query(queryBuilder, [dateFrom, dateTo, allStationsOp1, op2ID]) : [];
                const rowsOp2: [] = allStationsOp2.length > 0 ? await DbManager.getInstance()
                    .query(queryBuilder, [dateFrom, dateTo, allStationsOp2, op1ID]) : [];
                if (rowsOp1 && rowsOp1.length > 0 && rowsOp2 && rowsOp2.length) {
                    const resultOp1 = rowsOp1.pop();
                    const op1NumberOfPasses = resultOp1!['length'] ?? 0;
                    const op1PassesCost = resultOp1!['passesCost'] ?? 0;
                    const resultOp2 = rowsOp2.pop();
                    const op2NumberOfPasses = resultOp2!['length'] ?? 0;
                    const op12PassesCost = resultOp2!['passesCost'] ?? 0;

                    return RestResponse.success(res, {
                        authInfo: getSessionMessage(req),
                        description: "balanceAnalysis", body: {
                            op1_ID: op1ID,
                            op2_ID: op2ID,
                            RequestTimestamp: new Date().toISOString(),
                            PeriodFrom: dateFrom.toISOString(),
                            PeriodTo: dateTo.toISOString(),
                            Op1NumberOfPasses: op1NumberOfPasses,
                            Op1PassesCost: op1PassesCost,
                            Op2NumberOfPasses: op2NumberOfPasses,
                            Op2PassesCost: op12PassesCost,
                            balance: Math.abs(op1PassesCost - op12PassesCost),
                            debtor: (op1PassesCost < op12PassesCost) ? op1ID : op2ID,
                            paymentCode: uuid()
                        }, format
                    });
                } else {
                    return RestResponse.fail(res, ResponseStatus.NO_DATA);
                }
            } else {
                return RestResponse.fail(res, ResponseStatus.NO_DATA);
            }
        }
    }
    return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
}

const getStations = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const opID = req.query.opID as string;
    if (opID) {
        // Return all system stations
        const opStations: object[] = await getSystemStationsByOpID(opID);
        return RestResponse.success(res, {
            authInfo: getSessionMessage(req),
            description: "getStations", body: {
                stations: opStations,
                opID: opID
            }, format
        });
    } else {
        // Return all system stations
        const allStations: object[] = await getAllSystemStations();
        return RestResponse.success(res, {
            authInfo: getSessionMessage(req),
            description: "getStations", body: {
                stations: allStations,
            }, format
        });
    }
}

const getOperators = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const allOperators: string[] = await getAllSystemOperators();
    return RestResponse.success(res, {
        authInfo: getSessionMessage(req),
        description: "getOperators", body: {
            operators: allOperators,
        }, format
    });
}

export default {
    passesPerStation: passesPerStation,
    passesAnalysis: passesAnalysis,
    passesCost: passesCost,
    chargesBy: chargesBy,
    addPass: addPass,
    getStatistics: getStatistics,
    balanceAnalysis: balanceAnalysis,
    getStations: getStations,
    getOperators: getOperators
};
