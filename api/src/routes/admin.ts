import express from 'express';
import controller from '../controllers/admin';

const router = express.Router();
// The following routes concern admin operations
router.get('/healthcheck/', controller.healthCheck);
router.post('/resetpasses/', controller.resetPasses);
router.post('/resetstations/', controller.resetStations);
router.post('/resetvehicles/', controller.resetVehicles);
router.post('/resetoperators/', controller.resetOperators);

// Deprecated:
// router.post('/usermod/:username/:password', controller.usermod);
// router.get('/users/:username/', controller.users);
// router.post('/system/passesudp', controller.passesUdp);

export = router;

