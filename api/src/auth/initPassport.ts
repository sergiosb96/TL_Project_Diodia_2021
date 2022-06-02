import {getUser} from "../database/helper";
// The following secret will should be in a file and not in git in a production environment...
export const SUPER_SECRET = "NTUA Secret!!!"

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

export const initPassport = async (passport: any) => {
    const opts: any = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = SUPER_SECRET;
    passport.use(new JwtStrategy(opts, async (jtw_payload: any, done: any) => {
        const user = await getUser(jtw_payload.data.username);
        if (user) {
            delete user.salt;
            delete user.password;
            return done(null, user);
        } else {
            return done(null, false);
        }
    }))
}
