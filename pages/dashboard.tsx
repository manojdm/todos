import React, { use, useEffect } from "react";
import {
	ApolloClient,
	InMemoryCache,
	useQuery,
	gql,
	useMutation,
} from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

// Set up Apollo Client
const client = new ApolloClient({
	uri: "/api/graphql",
	cache: new InMemoryCache(),
});

//Query
const GET_TODOS_LIST = gql`
	{
		todos {
			id
			name
			description
			completed
			dueDate
		}
	}
`;

const GET_TODOS_LIST_BY_ID = gql`
	query GetTodos($userId: ID!) {
		getTodos(userId: $userId) {
			id
			name
			description
			completed
			dueDate
		}
	}
`;

const DELETE_TODO = gql`
	mutation DeleteTodo($id: ID!) {
		deleteTodo(id: $id)
	}
`;
const CHECK_USER = gql`
	query checkUser($username: String!, $email: String!) {
		checkUser(username: $username, email: $email) {
			id
			username
			email
		}
	}
`;

const todos = () => {
	//user data
	let userData: any;

	//router
	const router = useRouter();

	const { user, error: userError, isLoading } = useUser();

	useEffect(() => {
		if (
			(!isLoading && !user) ||
			(!isLoading && !user?.email) ||
			(!isLoading && user == undefined)
		) {
			router.push("/login");
		}
	}, [isLoading, user]);

	const { data: checkUser }: any = useQuery(CHECK_USER, {
		variables: {
			username: user?.nickname,
			email: user?.email,
		},
	});

	const userId = checkUser?.checkUser?.id;

	// Todos data
	const { loading, error, data, refetch } = useQuery(GET_TODOS_LIST_BY_ID, {
		variables: {
			userId: userId,
		},
		skip: !userId,
	});

	//delete query
	const [deleteTodo] = useMutation(DELETE_TODO);

	if (loading) {
		return <div className="title">Loading.....</div>;
	}

	const todos = data?.getTodos;

	const handleView = (id: string | number) => {
		router.push(`/todo/${id}`);
	};

	const handleEdit = (id: string | number) => {
		router.push(`/todo/${id}?type=edit`);
	};

	const handleDelete = async (id: string | number) => {
		try {
			const { data } = await deleteTodo({
				variables: {
					id,
				},
			});

			alert("Successfully deleted the todo");

			refetch();
		} catch (e: any) {
			return "Issue with creating the todo";
		}
	};

	return (
		<div className="todos-section card">
			<div className="todos-header">
				<div className="title">Todos !!</div>
				<div className="create-todos-btn">
					<Link href="/new">+ new todo</Link>
				</div>
			</div>
			<div className="todos-container">
				<div className="todo-cards">
					{data?.getTodos && data.getTodos.length > 0 ? (
						data.getTodos.map((todo: any) => (
							<div className="todo-card" key={todo.id}>
								<div className="todo-details">
									<div className="todo-created">{todo.dueDate}</div>
									<div className="todo-name">{todo.name}</div>
								</div>
								<div className="todo-status">
									{todo.completed ? (
										<div className="status completed">completed</div>
									) : (
										<div className="status in-progress">In progress</div>
									)}
								</div>
								<div className="todo-actions">
									<div
										onClick={() => handleView(todo.id)}
										className="action view"
									>
										<i className="fa-solid fa-eye"></i>
									</div>
									<div
										onClick={() => handleEdit(todo.id)}
										className="action edit"
									>
										<i className="fa-solid fa-pen-to-square"></i>
									</div>
									<div
										onClick={() => handleDelete(todo.id)}
										className="action delete"
									>
										<i className="fa-solid fa-trash"></i>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="no-todos title">No todos found</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default todos;
