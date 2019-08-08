var express = require("express");
var bodyParser = require("body-parser");
var { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
var { makeExecutableSchema } = require("graphql-tools");

// Apollo server in conjunction with express-server
var typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root) {
      return "world";
    }
  }
};

var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(4000, () => console.log("Now browse to localhost:4000/graphiql"));
var schema = makeExecutableSchema({ typeDefs, resolvers });
