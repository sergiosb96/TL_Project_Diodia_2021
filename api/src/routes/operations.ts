import express from 'express';
import controller from '../controllers/operations';

const passport = require('passport');
const router = express.Router();

// The following routes concern main operations
router.get('/PassesPerStation/:stationID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.passesPerStation);
router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.passesAnalysis);
router.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.passesCost);
router.get('/ChargesBy/:op_ID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.chargesBy);
router.get('/GetStatistics/:op_ID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.getStatistics);
router.get('/BalanceAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.balanceAnalysis);
router.get('/GetStations/', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.getStations);
router.get('/GetOperators/', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.getOperators);
router.post('/AddPass/', passport.authenticate(['jwt', 'anonymous'], {session: false}), controller.addPass);


export = router;

