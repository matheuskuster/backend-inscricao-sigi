const express = require("express");
const mongoose = require("mongoose");
const nunjucks = require("nunjucks");
const routes = require("./routes");
const cors = require("cors");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";

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

nunjucks.configure(path.resolve(__dirname, "views"), {
  autoescape: true,
  express: app,
  watch: isDev
});

app.use(express.static(path.resolve(__dirname, "public")));
app.set("view engine", "njk");

app.use(routes);

app.listen(process.env.PORT || 3333);
