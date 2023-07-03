import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { todo } from "node:test";

//setup chart
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
);

// Set up Apollo Client
const client = new ApolloClient({
	uri: "/api/graphql",
	cache: new InMemoryCache(),
});

//Query
const GET_TODOS_LIST_BY_ID = gql`
	query GetTodos($userId: ID!) {
		getTodos(userId: $userId) {
			id
			name
			description
			completed
			dueDate
			tomatoesConsumed
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

const todos = () => {
	//user data
	let userData: any;
	const [totalCompleted, setTotalCompleted] = useState(0);
	const [totalNotCompleted, setTotalNotCompleted] = useState(0);

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
	const { loading, error, data } = useQuery(GET_TODOS_LIST_BY_ID, {
		variables: {
			userId: userId,
		},
		skip: !userId,
	});

	const todos = data?.getTodos;

	useEffect(() => {
		if (todos && todos.length > 0) {
			console.log(todos);
			todos.forEach((todo: any) => {
				if (todo.completed) {
					setTotalCompleted(prev => prev + 1);
				} else {
					setTotalNotCompleted(prev => prev + 1);
				}
			});
		}
	}, [todos]);

	if (loading) {
		return <div className="title">Loading.....</div>;
	}

	if (error) {
		return "Todo not found...";
	}

	return (
		<div className="todos-section card stats">
			<div className="todos-header">
				<div className="title">Stats</div>
			</div>
			<div className="todos-container">
				<div className="todo-cards">
					{data?.getTodos && data.getTodos.length && (
						<div className="stats-container">
							<div className="stat line-chart">
								<div className="stat-name">
									Total tomatoes consumed for each task
								</div>
								<div className="chart">
									<Line
										data={{
											labels: todos.map((todo: any) => todo.name),
											datasets: [
												{
													label: "Tomatoes consumed",
													data: todos.map((todo: any) => todo.tomatoesConsumed),
													borderColor: "rgb(53, 162, 235)",
													backgroundColor: "rgba(53, 162, 235, 0.5)",
												},
											],
										}}
										options={{
											scales: {
												x: {
													type: "category",
												},
												y: {
													beginAtZero: true,
													ticks: {
														stepSize: 1,
													},
												},
											},
										}}
									/>
								</div>
							</div>
							<div className="stat bar">
								<div className="stat-title">Total tasks (Bar chart view):</div>
								<div className="chart">
									<Bar
										data={{
											labels: ["completed", "not completed"],
											datasets: [
												{
													label: "Total todos",
													data: [totalCompleted, totalNotCompleted],
													backgroundColor: "gray",
												},
											],
										}}
										options={{
											scales: {
												x: {
													type: "category",
												},
												y: {
													beginAtZero: true,
													ticks: {
														stepSize: 1,
													},
												},
											},
										}}
									/>
								</div>
							</div>
							<div className="stat pie-chart">
								<div className="stat-title">Total tasks (Pie chart view):</div>
								<div className="chart">
									<Pie
										data={{
											labels: ["completed", "not completed"],
											datasets: [
												{
													label: "Total todos",
													data: [totalCompleted, totalNotCompleted],
													backgroundColor: [
														"rgba(75, 192, 192, 0.2)",
														"rgba(255, 99, 132, 0.2)",
													],
													borderColor: [
														"rgba(75, 192, 192, 1)",
														"rgba(255, 99, 132, 1)",
													],
													borderWidth: 1,
												},
											],
										}}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default todos;
