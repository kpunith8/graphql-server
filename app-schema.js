var express = require("express");
var cors = require("cors");

var mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const { ApolloServer, gql } = require("apollo-server");

var app = express();
app.use(cors());

// Same implementation with express-graphql can be found in app.js, more organised

var db = mongoose.connect(
  "mongodb+srv://root:root@mongo-cluster-qclzr.mongodb.net/test?retryWrites=true&w=majority"
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const typeDefs = gql`
  input AuthorInput {
    name: String!
    age: Int!
  }

  input BookInput {
    name: String!
    genre: String!
    authorId: ID!
  }

  type Book {
    id: ID!
    name: String
    genre: String
    author: Author
  }

  type Author {
    id: ID
    name: String
    age: Int
    books: [Book]
  }

  type Query {
    book(id: ID!): Book
    author(id: ID!): Author
    authors: [Author]
    books: [Book]
  }

  type Mutation {
    addAuthor(input: AuthorInput): Author
    addBook(input: BookInput): Book
  }
`;

const resolvers = {
  Query: {
    book: (parent, args, context, info) => {
      return Book.findById(args.id);
    },

    books: () => {
      return Book.find({});
    },

    author: (parent, args, context, info) => {
      return Author.findById(args.id);
    },

    books: () => {
      return Author.find({});
    }
  },

  // If Book is the parent that has author as its nested resolver,
  // Add the resolver type author under Book as mentioned below
  Book: {
    author: (parent, args, context, info) => {
      return Author.findById(parent.authorId);
    }
  },

  Author: {
    books: (parent, args, context, info) => {
      console.log("Book id", parent.id);
      return Book.find({ authorId: parent.id });
    }
  },

  Mutation: {
    addAuthor: (parent, { input: { name, age } }, ctx) => {
      let author = new Author({
        name: name,
        age: age
      });

      return author.save();
    },

    addBook: (parent, { input: { name, genre, authorId } }, ctx) => {
      let book = new Book({
        name: name,
        genre: genre,
        authorId: authorId
      });

      return book.save();
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
