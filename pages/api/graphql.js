import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { GraphQLJSON } from 'graphql-scalars';


const prisma = new PrismaClient();

const typeDefs = gql`
	scalar JSON

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
		customFields: JSON
	}

	type Query {
		todos: [Todo!]!
		user: [User!]!
		todo(id: ID!, userId: ID!): Todo!
		getTodos(userId: ID!): [Todo!]!
		checkUser(username: String!, email: String!): User
	}

	type Mutation {
		createTodo(
			name: String!
			description: String!
			dueDate: String!
			userId: ID!
			customFields: JSON
		): Todo!

		updateTodo(
			id: ID!
			completed: Boolean
			tomatoesConsumed: Int
			customFields: JSON
		): Todo!

		deleteTodo(id: ID!): Boolean
	}
`;

const resolvers = {
	JSON: GraphQLJSON,
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
		todo: async (_, { id, userId }) => {
			try {
				const todo = await prisma.todo.findFirst({
					where: { id: parseInt(id), userId: parseInt(userId) },
				});
				return todo;
			} catch (error) {
				throw new Error("Failed to fetch the todo.");
			}
		},
		getTodos: async (_, { userId }) => {
			try {
				const todos = await prisma.todo.findMany({
					where: {
						userId: parseInt(userId),
					},
				});
				return todos;
			} catch (error) {
				throw new Error("Failed to fetch todos");
			}
		},
		checkUser: async (_, args) => {
			const { username, email } = args;
			try {
				const user = await prisma.user.findFirst({
					where: {
						email,
					},
				});

				if (user) {
					return user;
				} else {
					const createdUser = await prisma.user.create({
						data: {
							username,
							email,
						},
					});

					return createdUser;
				}
			} catch (error) {
				throw new Error("Failed to check user");
			}
		},
	},
	Mutation: {
		createTodo: async (_, args) => {
			const { name, userId, description, dueDate, customFields } = args;
			try {
				const todo = await prisma.todo.create({
					data: {
						name,
						completed: false,
						description,
						dueDate,
						customFields: JSON.stringify(customFields),
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
			const { id, completed, tomatoesConsumed, customFields } = args;
			try {
				const updatedTodo = await prisma.todo.update({
					where: { id: parseInt(id) },
					data: { completed, tomatoesConsumed, customFields},
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
