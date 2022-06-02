import mysql from "mysql";
import util from "util";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1713231996",
  database: "ntua",
});

const makeQuery = util.promisify(pool.query).bind(pool);

export const query = async (queryStr, params, callback) => {
  let result;
  try {
    result = await makeQuery(queryStr, params);
  } catch (err) {
    result = err.message;
  } finally {
    return result;
  }
};
