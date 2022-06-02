import {PoolConnection} from "mariadb";

const db = require('./db')

/***
 * This class is used for db management
 */
export class DbManager {
    private static instance: DbManager;

    private constructor() {
    }

    // Make a db query
    public async query(command: string, params?: any[]): Promise<any> {
        let conn: PoolConnection | undefined;
        let returnData;
        try {
            conn = await db.pool.getConnection();
            if (params) {
                returnData = await conn?.query(command, params);
            } else {
                returnData = await conn?.query(command);
            }
        } catch (err) {
            console.log(err);
        } finally {
            // Close Connection
            if (conn) await conn.end();
        }
        return returnData;
    }

    // This function returns a connection string
    public async getConnectionString(): Promise<string | null> {
        let conn: PoolConnection | undefined;
        let returnData = null;
        try {
            conn = await db.pool.getConnection();
            if (conn) {
                returnData = conn.ping().then(() => {
                    return JSON.stringify(conn?.info?.serverVersion);
                }).catch((err) => null)
            }
        } catch (err) {
            console.log(err);
        } finally {
            if (conn) await conn.end();
        }
        return returnData;
    }

    // This function returns a dbManager instance
    static getInstance(): DbManager {
        if (this.instance == null) {
            this.instance = new DbManager();
        }
        return this.instance;
    }
}
