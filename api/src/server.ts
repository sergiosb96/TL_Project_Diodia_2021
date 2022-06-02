import http from 'http';
import express, {Express} from 'express';
import morgan from 'morgan';


import auth from './routes/auth';
import admin from './routes/admin';
import operations from './routes/operations';
import {initPassport} from "./auth/initPassport";


const session = require('express-session');
const cors = require('cors')
const router: Express = express();

const passport = require('passport');
const AnonymousStrategy = require('passport-anonymous');
passport.use(new AnonymousStrategy());

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({extended: false}));
/** Takes care of JSON data */
router.use(express.json());

router.use(session({
    secret: 'NTUA secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
    },
}))
router.use(passport.initialize());
router.use(passport.session());

initPassport(passport);

router.use(cors());
/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/interoperability/api/', operations);
router.use('/interoperability/api/', auth);
router.use('/interoperability/api/admin', admin);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 9103;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
