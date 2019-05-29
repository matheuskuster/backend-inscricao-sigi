const express = require("express");
const router = express.Router();
const SubscriptionController = require("./controllers/SubscriptionController");
const multer = require("multer");
const multerConfig = require("./config/multer");

router.get("/show/:cnpj", SubscriptionController.showSchool);

router.post(
  "/term/:cnpj",
  multer(multerConfig).single("term"),
  SubscriptionController.uploadTerm
);

router.post("/subscription", SubscriptionController.handleSubscription);

module.exports = router;
