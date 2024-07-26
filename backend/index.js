const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const users = [
  { id: '1', username: 'john_doe', password: 'password123', email: 'john@example.com' },
  { id: '2', username: 'jane_smith', password: 'password456', email: 'jane@example.com' }
];

const transactions = [
  { id: '1', userId: '1', description: 'Salary', category: 'Income', amount: 5000, date: '2023-06-01' },
  { id: '2', userId: '1', description: 'Rent', category: 'Expense', amount: 1200, date: '2023-06-05' },
  { id: '3', userId: '1', description: 'Groceries', category: 'Expense', amount: 300, date: '2023-06-10' },
  { id: '4', userId: '2', description: 'Freelance Project', category: 'Income', amount: 1500, date: '2023-06-15' },
  { id: '5', userId: '2', description: 'Utilities', category: 'Expense', amount: 200, date: '2023-06-20' }
];

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
    transactions: (_, { userId }) => transactions.filter(transaction => transaction.userId === userId),
    transaction: (_, { id }) => transactions.find(transaction => transaction.id === id),
  },
  Mutation: {
    login: (_, { username, password }) => {
      const user = users.find(user => user.username === username && user.password === password);
      if (!user) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
      return { ...user, token };
    },
    register: (_, { username, email, password }) => {
      const existingUser = users.find(user => user.username === username || user.email === email);
      if (existingUser) throw new Error('User already exists');
      const newUser = { id: String(users.length + 1), username, email, password };
      users.push(newUser);
      const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'your_secret_key', { expiresIn: '1h' });
      return { ...newUser, token };
    },
    addTransaction: (_, { userId, description, category, amount, date }) => {
      const newTransaction = { id: String(transactions.length + 1), userId, description, category, amount, date };
      transactions.push(newTransaction);
      return newTransaction;
    },
    editTransaction: (_, { id, description, category, amount, date }) => {
      const transaction = transactions.find(transaction => transaction.id === id);
      if (!transaction) throw new Error('Transaction not found');
      if (description !== undefined) transaction.description = description;
      if (category !== undefined) transaction.category = category;
      if (amount !== undefined) transaction.amount = amount;
      if (date !== undefined) transaction.date = date;
      return transaction;
    },
    deleteTransaction: (_, { id }) => {
      const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
      if (transactionIndex === -1) throw new Error('Transaction not found');
      transactions.splice(transactionIndex, 1);
      return true;
    }
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