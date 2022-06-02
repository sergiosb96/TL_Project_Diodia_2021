import express from 'express';
import controller from '../controllers/auth';

const passport = require('passport');
const router = express.Router();

// The following routes concern authentication operations
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/getProfile', passport.authenticate('jwt', {session: false}), controller.getProfile);

export = router;

