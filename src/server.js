const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');


mongoose.connect(`mongodb+srv://sigi:${process.env.MONGO_PASSWORD}@cluster0-cdj1t.mongodb.net/inscricao_sigi?retryWrites=true`, {
    useNewUrlParser: true
})


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(process.env.PORT || 3333);