import {NextFunction, Request, Response} from "express";
import {getResponseBodyFormat, ResponseStatus, RestResponse} from "../utils/restResponse";
import {DbManager} from "../database/dbManager";
import fs from "fs";

/***
 * This function check a health state of database and returns a connection string message
 * @param req
 * @param res
 * @param next
 */

const healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const connectionString = await DbManager.getInstance().getConnectionString();
    if (connectionString) {
        return RestResponse.success(res, {description: connectionString, format});
    } else {
        return RestResponse.fail(res, ResponseStatus.SERVER_ERROR);
    }
};

/***
 * This function reset all passes. Actually removes all passes from database
 * and if the init parameter given, then insert all samples passes.
 * @param req
 * @param res
 * @param next
 */
const resetPasses = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const initialization: boolean = !!(req.query.init) ?? false;
    const buffer = fs.readFileSync(__dirname + "/../resetFiles/Pass_202112200104.sql");

    const fileContent = buffer.toString();
    await DbManager.getInstance().query('DELETE FROM Pass');
    if (initialization) {
        for (const row of fileContent.split(';')) {
            if (row.trim() != '') {
                if (!await DbManager.getInstance().query(row.trim() + ';')) {
                    return RestResponse.fail(res, ResponseStatus.SERVER_ERROR);
                }
            }
        }
    }

    return RestResponse.success(res, {description: "Reset Pass successfully", format});
};

/***
 * This function reset all stations with sample stations
 * @param req
 * @param res
 * @param next
 */
const resetStations = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const buffer = fs.readFileSync(__dirname + "/../resetFiles/Stations_202112200104.sql");

    const fileContent = buffer.toString();
    await DbManager.getInstance().query('DELETE FROM Stations');
    for (const row of fileContent.split(';')) {
        if (row.trim() != '') {
            if (!await DbManager.getInstance().query(row.trim() + ';')) {
                return RestResponse.fail(res, ResponseStatus.SERVER_ERROR);
            }
        }
    }

    return RestResponse.success(res, {description: "Reset Stations successfully", format});
};

/***
 * This function reset all vehicles with sample vehicles
 * @param req
 * @param res
 * @param next
 */
const resetVehicles = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const buffer = fs.readFileSync(__dirname + "/../resetFiles/Vehicles_202112200104.sql");

    const fileContent = buffer.toString();
    await DbManager.getInstance().query('DELETE FROM Vehicles');
    for (const row of fileContent.split(';')) {
        if (row.trim() != '') {
            if (!await DbManager.getInstance().query(row.trim() + ';')) {
                return RestResponse.fail(res, ResponseStatus.SERVER_ERROR);
            }
        }
    }

    return RestResponse.success(res, {description: "Reset Vehicles successfully", format});
};

/***
 * This function reset all operators with sample operators
 * @param req
 * @param res
 * @param next
 */
const resetOperators = async (req: Request, res: Response, next: NextFunction) => {
    const format = getResponseBodyFormat(req.query.format);
    const buffer = fs.readFileSync(__dirname + "/../resetFiles/Operators_202112210006.sql");

    const fileContent = buffer.toString();
    await DbManager.getInstance().query('DELETE FROM Operators');
    for (const row of fileContent.split(';')) {
        if (row.trim() != '') {
            if (!await DbManager.getInstance().query(row.trim() + ';')) {
                return RestResponse.fail(res, ResponseStatus.SERVER_ERROR);
            }
        }
    }

    return RestResponse.success(res, {description: "Reset Operators successfully", format});
};

// // Deprecated: usermod
// const usermod = async (req: Request, res: Response, next: NextFunction) => {
//     // TODO
//     const username = req.params['username'];
//     const password = req.params['password'];
//     if (username && password) {
//         return RestResponse.success(res, {description: "usermod TODO"});
//     } else {
//         return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
//     }
// };
//
// // Deprecated: users
// const users = async (req: Request, res: Response, next: NextFunction) => {
//     // TODO
//     const username = req.params['username'];
//
//     if (username) {
//         return RestResponse.success(res, {description: "users TODO"});
//     } else {
//         return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
//     }
// };
//
// // Deprecated: passesUdp
// const passesUdp = async (req: Request, res: Response, next: NextFunction) => {
//     // TODO
//
//     return RestResponse.success(res, {description: "passesUdp TODO"});
// };

export default {
    /*  usermod: usermod,
      users: users,
      passesUdp: passesUdp,*/
    healthCheck: healthCheck,
    resetPasses: resetPasses,
    resetStations: resetStations,
    resetVehicles: resetVehicles,
    resetOperators: resetOperators
};
