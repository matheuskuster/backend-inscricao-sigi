const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");

mongoose.connect(
  `mongodb+srv://sigi:${process.env.MONGO_PASSWORD ||
    "uSVRsiQF5u9fXaQy"}@cluster0-cdj1t.mongodb.net/inscricao_sigi?retryWrites=true`,
  {
    useNewUrlParser: true
  }
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(process.env.PORT || 3333);
