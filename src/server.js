const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');


mongoose.connect('mongodb+srv://kuster:mkr15112001@cluster0-68ngh.mongodb.net/sigi_inscricao?retryWrites=true', {
    useNewUrlParser: true
})

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(process.env.PORT || 3333);