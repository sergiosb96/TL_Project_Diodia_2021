import {getUser} from "../database/helper";
import {SUPER_SECRET} from "./initPassport";

const jwt = require('jsonwebtoken')
const crypto = require('crypto');

/***
 * This function returns a session message for test/debug reasons
 * @param req
 */
export const getSessionMessage = (req: any): string => {
    let returnMsg = 'You are anonymous - Allow access only for test/dev reasons';
    if (req.user) {
        const user = req.user;
        returnMsg = 'You are ' + user.username + ' user';
        returnMsg += ' - Your user type is \'' + user.type + '\'';

        if (user.type === 'operator') {
            returnMsg += ' - Your operatorId is \'' + user.operatorId + '\'';
        }
    }

    return returnMsg;
}


/***
 * This function returns a user if the username and password are correct, else returns null
 * @param username
 * @param password
 */
export const checkUsernameAndPassword = async (username: string, password: string): Promise<any> => {
    const user = await getUser(username);

    if (user) {
        return new Promise((resolve) => {
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async (err: Error | null, hashedPassword: Buffer) => {
                if (crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword) && !(err)) {
                    delete user.password;
                    delete user.salt;
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        })
    }

    return null;
}
/**
 * This function returns a user token
 * @param user
 */
export const createAndGetAUserTokenAndExpireSecs = (user: object): any[] => {
    const expiresIn = 604800;
    return ['Bearer ' + (jwt.sign({data: user}, SUPER_SECRET, {
        expiresIn: expiresIn //1 week
    })), expiresIn];
}

// const createPassword = async (username: string, hash: string) => {
//     const results = await DbManager.getInstance()
//         .query("UPDATE Users SET password = (?) WHERE username = (?)", [hash, username]);
// }
