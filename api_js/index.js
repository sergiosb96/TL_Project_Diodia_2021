import express from "express";
import http from "http";
import cors from "cors";

// import auth from "./src/routes/auth.js";
// import admin from "./src/routes/admin.js";
import operations from "./src/routes/operations.js";

const router = express();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// RULES OF OUR API
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes **/
router.use("/interoperability/api/", operations);
// router.use("/interoperability/api/", auth);
// router.use("/interoperability/api/admin", admin);

/** Error handling **/
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server **/
const httpServer = http.createServer(router);
const PORT = process.env.PORT || 9103;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
