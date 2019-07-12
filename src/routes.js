const express = require("express");
const router = express.Router();
const SubscriptionController = require("./controllers/SubscriptionController");
const multer = require("multer");
const multerConfig = require("./config/multer");

router.get("/show/:cnpj", SubscriptionController.showSchool);

// router.post(
//   "/term/:id",
//   multer(multerConfig).single("term"),
//   SubscriptionController.uploadTerm
// );

// router.post("/subscription", SubscriptionController.handleSubscription);

// router.get("/sheet/:cnpj", SubscriptionController.createSheet);

router.get("/show", SubscriptionController.show);

router.get("/admin", SubscriptionController.adminIndex);

router.post("/admin/sheet/:id", SubscriptionController.createSheetForAdmin);

router.post("/fix/:cnpj", SubscriptionController.fixSchool);

router.get("/admin/download/:file", SubscriptionController.fileDownload);

module.exports = router;
