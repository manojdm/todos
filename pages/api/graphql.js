import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    name: String!
    completed: Boolean!
    description: String!
    dueDate: String!
    tomatoesConsumed: Int!
    userId: ID!
  }

  type Query {
    todos: [Todo!]!
    user: [User!]!
    todo(
      id: ID!
    ): Todo!
  }

  type Mutation {
    createTodo(
      name: String!
      description: String!
      dueDate: String!
      userId: ID!
    ): Todo!

    updateTodo(
      id: ID!
      completed: Boolean
      tomatoesConsumed: Int
    ): Todo!

    deleteTodo(
      id: ID!
    ): Boolean
  }
`;

const resolvers = {
  Query: {
    todos: async () => {
      try {
        const todos = await prisma.todo.findMany();
        return todos;
      } catch (error) {
        throw new Error("Failed to fetch todos");
      }
    },
    user: async () => {
      try {
        const users = await prisma.user.findMany({
          include: {
            todos: true,
          },
        });
        return users;
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
    todo: async (_, { id }) => {
      try {
        const todo = await prisma.todo.findUnique({
          where: { id: parseInt(id) },
        });
        return todo;
      } catch (error) {
        throw new Error("Failed to fetch the todo.");
      }
    },
  },
  Mutation: {
    createTodo: async (_, args) => {
      const { name, userId, description, dueDate } = args;
      try {
        const todo = await prisma.todo.create({
          data: {
            name,
            completed: false,
            description,
            dueDate,
            tomatoesConsumed: 0,
            userId: parseInt(userId),
          },
        });
        return todo;
      } catch (error) {
        throw new Error("Failed to create todo");
      }
    },
    updateTodo: async (_, args) => {
      const { id, completed, tomatoesConsumed } = args;
      try {
        const updatedTodo = await prisma.todo.update({
          where: { id: parseInt(id) },
          data: { completed, tomatoesConsumed },
        });
        return updatedTodo;
      } catch (error) {
        throw new Error("Failed to update todo");
      }
    },
    deleteTodo: async (_, args) => {
      const { id } = args;
      try {
        await prisma.todo.delete({ where: { id: parseInt(id) } });
        return true;
      } catch (error) {
        throw new Error("Failed to delete todo");
      }
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
