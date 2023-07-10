import React, { useEffect, useState } from "react";
import {
	ApolloClient,
	InMemoryCache,
	gql,
	useMutation,
	useQuery,
} from "@apollo/client";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";

// Set up Apollo Client
const client = new ApolloClient({
	uri: "/api/graphql",
	cache: new InMemoryCache(),
});

const CREATE_TODO_MUTATION = gql`
	mutation CreateTodo(
		$name: String!
		$description: String!
		$dueDate: String!
		$userId: ID!
	) {
		createTodo(
			name: $name
			description: $description
			dueDate: $dueDate
			userId: $userId
		) {
			id
			name
			completed
			description
			dueDate
			tomatoesConsumed
			userId
		}
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

const NewTodo = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState("");
	const [keys, setKeys] = useState("");
	const [values, setValues] = useState("");

	const [createTodo] = useMutation(CREATE_TODO_MUTATION);

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
	}, [isLoading]);

	const { data: checkUser }: any = useQuery(CHECK_USER, {
		variables: {
			username: user?.nickname,
			email: user?.email,
		},
	});

	const userId = checkUser?.checkUser?.id;

	const handleCreateTodo = async (e: any) => {
		e.preventDefault();

		try {
			const { data } = await createTodo({
				variables: {
					name: title,
					description,
					dueDate: date,
					userId: userId,
				},
			});

			setTitle("");
			setDescription("");
			setDate("");

			if (data.createTodo.id) {
				router.push(`/todo/${data.createTodo.id}`);
			}
		} catch (e: any) {
			return "Issue with creating the todo";
		}
	};

	return (
		<>
			<div className="todo-section card">
				<div className="title">New Todo</div>
				<div className="todo-content">
					<div className="todo-editor">
						<div className="form-container">
							<form onSubmit={e => handleCreateTodo(e)}>
								<div className="form-div title-div">
									<label>Title</label>
									<input
										className="title-input"
										type="text"
										value={title}
										onChange={e => setTitle(e.target.value)}
									/>
								</div>
								<div className="form-div description">
									<label>Description</label>
									<input
										className="description-input"
										type="text"
										value={description}
										onChange={e => setDescription(e.target.value)}
									/>
								</div>
								<div className="form-div due-date">
									<label>Due date</label>
									<input
										type="date"
										className="duedate"
										value={date}
										onChange={e => setDate(e.target.value)}
									/>
								</div>
								<div className="form-div custom-fields">
									<label>Custom Fields</label>
									<div className="field">
										<textarea placeholder="key" className="semi-div keys" />
										<textarea placeholder="value" className="semi-div values" />
									</div>
								</div>
								<div className="form-div form-cta update">
									<input type="submit" value="Create Todo" />
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewTodo;
