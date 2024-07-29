const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFilePath = path.join(__dirname, 'users.json');
const transactionsFilePath = path.join(__dirname, 'transactions.json');

// Helper functions to read and write JSON files
const readJSONFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }
  type Transaction {
    id: ID!
    userId: ID!
    description: String!
    category: String!
    amount: Float!
    date: String!
  }
  type Query {
    transactions(userId: ID!): [Transaction]
    transaction(id: ID!): Transaction
  }
  type Mutation {
    login(username: String!, password: String!): User
    register(username: String!, email: String!, password: String!): User
    addTransaction(userId: ID!, description: String!, category: String!, amount: Float!, date: String!): Transaction
    editTransaction(id: ID!, description: String, category: String, amount: Float, date: String): Transaction
    deleteTransaction(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    transactions: (_, { userId }) => {
      const transactions = readJSONFile(transactionsFilePath);
      return transactions.filter(transaction => transaction.userId === userId);
    },
    transaction: (_, { id }) => {
      const transactions = readJSONFile(transactionsFilePath);
      return transactions.find(transaction => transaction.id === id);
    },
  },
  Mutation: {
    login: (_, { username, password }) => {
      const users = readJSONFile(usersFilePath);
      const user = users.find(user => user.username === username && user.password === password);
      if (!user) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
      return { ...user, token };
    },
    register: (_, { username, email, password }) => {
      try {
        const users = readJSONFile(usersFilePath);
        const existingUser = users.find(user => user.username === username || user.email === email);
        if (existingUser) throw new Error('User already exists');
        const newUser = { id: uuidv4(), username, email, password };
        users.push(newUser);
        writeJSONFile(usersFilePath, users);
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'your_secret_key', { expiresIn: '1h' });
        return { ...newUser, token };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed');
      }
    },
    addTransaction: (_, { userId, description, category, amount, date }) => {
      try {
        const transactions = readJSONFile(transactionsFilePath);
        const newTransaction = { id: uuidv4(), userId, description, category, amount, date };
        transactions.push(newTransaction);
        writeJSONFile(transactionsFilePath, transactions);
        return newTransaction;
      } catch (error) {
        console.error('Error adding transaction:', error);
        throw new Error('Failed to add transaction');
      }
    },
    editTransaction: (_, { id, description, category, amount, date }) => {
      const transactions = readJSONFile(transactionsFilePath);
      const transaction = transactions.find(transaction => transaction.id === id);
      if (!transaction) throw new Error('Transaction not found');
      if (description !== undefined) transaction.description = description;
      if (category !== undefined) transaction.category = category;
      if (amount !== undefined) transaction.amount = amount;
      if (date !== undefined) transaction.date = date;
      writeJSONFile(transactionsFilePath, transactions);
      return transaction;
    },
    deleteTransaction: (_, { id }) => {
      let transactions = readJSONFile(transactionsFilePath);
      const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
      if (transactionIndex === -1) throw new Error('Transaction not found');
      transactions = transactions.filter(transaction => transaction.id !== id);
      writeJSONFile(transactionsFilePath, transactions);
      return true;
    },
  }
};

const app = express();
app.use(cors());

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();