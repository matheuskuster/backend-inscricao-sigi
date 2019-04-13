const express = require('express');
const router = express.Router();
const SubscriptionController = require('./controllers/SubscriptionController');
const multer = require('multer');
const multerConfig = require('./config/multer');   

router.get('/show/:cnpj', SubscriptionController.showSchool);

router.post('/school/store', SubscriptionController.createSchool);

router.post('/school/:cnpj/teacher', SubscriptionController.createAndSetTeacher);

router.post('/sheet', SubscriptionController.createSheet);

router.post('/term/:cnpj', multer(multerConfig).single('term'), SubscriptionController.uploadTerm);

router.post('/email/:cnpj', SubscriptionController.notificationToEmail);

module.exports = router;

