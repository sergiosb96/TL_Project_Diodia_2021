import express from "express";
import backend from "../backend/operations.js";

const router = express.Router();

router.get(
  "/PassesPerStation/:stationID/:date_from/:date_to",
  backend.passesPerStation
);
router.get(
  "/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to",
  backend.passesAnalysis
);
router.get(
  "/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to",
  backend.passesCost
);
router.get("/ChargesBy/:op_ID/:date_from/:date_to", backend.chargesBy);
router.get("/GetStatistics/:op_ID/:date_from/:date_to", backend.getStatistics);
// router.get(
//   "/BalanceAnalysis/:op1_ID/:op2_ID/:date_from/:date_to",
//   backend.balanceAnalysis
// );
router.post("/AddPass/", backend.addPass);

export default router;