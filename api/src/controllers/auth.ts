import {NextFunction, Request, Response} from "express";
import {getResponseBodyFormat, ResponseStatus, RestResponse} from "../utils/restResponse";
import {checkUsernameAndPassword, createAndGetAUserTokenAndExpireSecs} from "../auth/utils";

/***
 * This function returns a success message after user login
 * @param req
 * @param res
 * @param next
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body['username'];
    const password = req.body['password'];

    if (username && password) {
        const user = await checkUsernameAndPassword(username, password);
        if (user) {
            const [token, tokenExpiresInSecs] = createAndGetAUserTokenAndExpireSecs(user);
            return RestResponse.success(res, {
                description: "Login Successfully",
                body: {token: token, profile: user, tokenExpiresInSecs: tokenExpiresInSecs}
            });
        } else {
            return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
        }
    } else {
        return RestResponse.fail(res, ResponseStatus.BAD_REQUEST);
    }
};


/***
 * This function logout a user
 * @param req
 * @param res
 * @param next
 */
const logout = async (req: any, res: Response, next: NextFunction) => {
    await req?.logout();
    const format = getResponseBodyFormat(req.query.format);
    return RestResponse.success(res, {description: "Logout Successfully", format});
};

/***
 * This function returns the profile of user
 * @param req
 * @param res
 * @param next
 */
const getProfile = async (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    return (user) ? RestResponse.success(res, {body: {profile: user}}) : RestResponse.fail(res, ResponseStatus.NOT_AUTHORIZED);
};

export default {
    login: login,
    logout: logout,
    getProfile: getProfile
};
