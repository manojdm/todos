import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
	ApolloClient,
	InMemoryCache,
	useQuery,
	gql,
	useMutation,
} from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";

// Set up Apollo Client
const client = new ApolloClient({
	uri: "/api/graphql",
	cache: new InMemoryCache(),
});

function showNotification(message: string) {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	} else if (Notification.permission === "granted") {
		const notification = new Notification(message);
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(permission => {
			if (permission === "granted") {
				const notification = new Notification(message);
			} else if (permission === "denied") {
				alert("Please enable notifications to receive task updates!!");
			}
		});
	}
}

function requestPermission() {
	if (Notification.permission == "denied") {
		alert("Please enable notifications to receive task updates!!");
		Notification.requestPermission();
	}
}

// Query
const GET_TODO = gql`
	query GetTodo($id: ID!, $userId: ID!) {
		todo(id: $id, userId: $userId) {
			id
			name
			description
			completed
			dueDate
			tomatoesConsumed
		}
	}
`;

const UPDATE_TODO = gql`
	mutation UpdateTodo($id: ID!, $completed: Boolean!, $tomatoesConsumed: Int!) {
		updateTodo(
			id: $id
			completed: $completed
			tomatoesConsumed: $tomatoesConsumed
		) {
			id
			name
			completed
			description
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

const Todo = () => {
	const { user, error: userError, isLoading } = useUser();
	// refs
	const startTodoBtn = useRef<HTMLDivElement | null>(null);
	const timer = useRef<HTMLDivElement | null>(null);
	const pause = useRef<HTMLDivElement | null>(null);
	const play = useRef<HTMLDivElement | null>(null);
	const stop = useRef<HTMLDivElement | null>(null);

	// timer state
	const [running, setRunning] = useState(false);
	const [minutes, setMinutes] = useState(25);
	const [seconds, setSeconds] = useState(0);

	//Tomatoes consumed
	const [tomatoesConsumed, setTomatoesConsumed] = useState(0);

	// current state
	const [current, setCurrent] = useState<"pomodoro" | "break">("pomodoro");

	// get query id
	const router = useRouter();
	const id = router.query.id;

	// get search params
	const params = useSearchParams();
	const type = params.get("type");

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

	const { loading, error, data, refetch } = useQuery(GET_TODO, {
		variables: {
			id: id,
			userId: userId,
		},
	});
	const [updateTodo] = useMutation(UPDATE_TODO);

	const timerFunction = () => {
		const pmaxMinutes = 25;
		const bmaxMinutes = 5;

		if (seconds === 0) {
			if (minutes === 0) {
				if (current === "pomodoro") {
					setTomatoesConsumed(prev => prev + 1);
					setMinutes(bmaxMinutes);
					setCurrent("break");
					showNotification(
						"Focus time has been ended. you can have 5 minutes of break or click on complete the task to mark complete"
					);
				} else {
					setMinutes(pmaxMinutes);
					setCurrent("pomodoro");
					showNotification(
						"Break time has been ended. Please have 25 minutes of focus time or click complete the task to mark complete"
					);
				}
			} else {
				setMinutes(prevMinutes => prevMinutes - 1);
				setSeconds(59);
			}
		} else {
			setSeconds(prevSeconds => prevSeconds - 1);
		}
	};

	useEffect(() => {
		requestPermission();

		let interval: any;

		if (running) {
			if (play.current && pause.current) {
				play.current.style.display = "none";
				pause.current.style.display = "block";
			}

			interval = setInterval(timerFunction, 1000);
		} else {
			if (pause.current && play.current) {
				pause.current.style.display = "none";
				play.current.style.display = "block";
			}

			clearInterval(interval);
		}

		// Clearing the interval on cleanup
		return () => {
			clearInterval(interval);
		};
	}, [running, minutes, seconds]);

	if (loading) {
		return "Loading...";
	}

	if (error) {
		return "Todo not found...";
	}

	const todo = data.todo;

	// Mark complete Event listener
	const handleMarkComplete = async (e: any, id: string | number) => {
		e.preventDefault();

		try {
			const { data } = await updateTodo({
				variables: {
					id: String(id), // Convert id to string
					completed: true,
					tomatoesConsumed,
				},
			});

			if (data.updateTodo.completed) {
				refetch();
			}
		} catch (e: any) {
			return "Issue with marking the todo complete";
		}
	};

	const handleStartTodo = () => {
		if (startTodoBtn.current && timer.current) {
			startTodoBtn.current.style.display = "none";
			timer.current.style.display = "block";
			setRunning(true);
		}
		showNotification("Pomodoro started!!");
	};

	const handlePause = () => {
		setRunning(false);
	};

	const handlePlay = () => {
		setRunning(true);
	};

	const handleReset = () => {
		setRunning(false);
		setMinutes(25);
		setSeconds(0);
		setTomatoesConsumed(0);
	};

	return (
		<div className="todo-section card">
			{!loading && data ? (
				<>
					<div className="title">Todo: {todo.name}</div>
					{!todo.completed && (
						<>
							<div
								ref={startTodoBtn}
								onClick={handleStartTodo}
								className="todo-start"
							>
								Start Todo
							</div>
							<div ref={timer} className="todo-timer hide">
								<div className="timer-status">
									Status: {current == "pomodoro" ? "Focus Time" : "Break Time"}
								</div>
								<div className="count timer">
									<span className="minutes">
										{minutes.toString().padStart(2, "0")}
									</span>{" "}
									:{" "}
									<span className="seconds">
										{seconds.toString().padStart(2, "0")}
									</span>
								</div>
								<div className="timer-actions">
									<div className="pause">
										<i
											onClick={handlePause}
											ref={pause}
											className="fa-solid fa-pause"
										></i>
										<i
											onClick={handlePlay}
											ref={play}
											className="fa-solid fa-play"
										></i>
									</div>
									<div className="reset">
										<i
											onClick={handleReset}
											className="fa-sharp fa-solid fa-arrow-rotate-left"
										></i>
									</div>
									<div className="stop">
										<i
											onClick={e => handleMarkComplete(e, todo.id)}
											ref={stop}
											className="fa-solid fa-stop"
										></i>
									</div>
								</div>
								<div className="message">Please don't close this window</div>
							</div>
						</>
					)}
					<div className="todo-content">
						<div className="todo-details">
							<div className="created">Due Date: {todo.dueDate}</div>
							<div className="tomatoes">
								<i className="fa-solid fa-apple-whole"></i>:{" "}
								{todo.completed ? todo.tomatoesConsumed : tomatoesConsumed}
							</div>
						</div>
						<div className="todo-editor">
							<div className="form-container">
								<form>
									<div className="form-div title-div">
										<label>Title</label>
										<input
											className="title-input"
											type="text"
											value={todo.name}
											disabled={type === "edit" ? false : true}
										/>
									</div>
									<div className="form-div description">
										<label>description</label>
										<input
											className="description-input"
											type="text"
											value={todo.description}
											disabled={type === "edit" ? false : true}
										/>
									</div>
									<div className="form-div due-date">
										<label>Due date</label>
										<input
											type="date"
											className="duedate"
											value={todo.dueDate}
											disabled={type === "edit" ? false : true}
										/>
									</div>
									<div className="form-div form-cta update hide">
										<input
											type="submit"
											value="update"
											disabled={type === "edit" ? false : true}
										/>
									</div>
									{!todo.completed ? (
										<div className="form-div form-cta complete">
											<input
												onClick={e => handleMarkComplete(e, todo.id)}
												className="complete"
												type="submit"
												value="mark complete"
											/>
										</div>
									) : (
										<div className="form-div form-cta complete">
											<input
												className="complete"
												type="submit"
												value="completed"
												disabled
											/>
										</div>
									)}
								</form>
							</div>
						</div>
					</div>
				</>
			) : (
				"Todo not found"
			)}
		</div>
	);
};

export default Todo;
