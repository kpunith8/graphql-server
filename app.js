const express = require("express");
const graphQLHTTP = require("express-graphql");
const schema = require("./schema/schema");
var mongoose = require("mongoose");
var cors = require("cors");

const port = 4000;
const app = express();
app.use(cors());

var db = mongoose.connect(
  "mongodb+srv://root:root@mongo-cluster-qclzr.mongodb.net/test?retryWrites=true&w=majority"
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(
  "/graphql",
  graphQLHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log("Server in running at port: " + port);
});
