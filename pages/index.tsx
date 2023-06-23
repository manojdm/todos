import { useQuery, useMutation, gql } from '@apollo/client';


const GET_TODOS_QUERY = gql`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation CreateTodoMutation($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_TODOS_QUERY);
  const [createTodo] = useMutation(CREATE_TODO_MUTATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateTodo = async () => {
    const title = prompt('Enter a todo title');
    if (title) {
      try {
        await createTodo({
          variables: { title },
          refetchQueries: [{ query: GET_TODOS_QUERY }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Todos</h1>
      <button onClick={handleCreateTodo}>Create Todo</button>
      <ul>
        {data.todos.map((todo: any) => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'Completed' : 'Incomplete'}
          </li>
        ))}
      </ul>
    </div>
  );
}
