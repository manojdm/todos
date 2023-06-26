import React from 'react'
import { ApolloClient, InMemoryCache, useQuery, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Set up Apollo Client
const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
});

//Query
const GET_TODOS_LIST = gql`
{
    todos {
      id,
      name,
      description,
      completed,
      dueDate
    }
  }
`
const DELETE_TODO = gql `
mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
}
`

const todos = () => {

    //Todos data
    const { loading, error, data, refetch } = useQuery(GET_TODOS_LIST);

    //delete query
    const [deleteTodo] = useMutation(DELETE_TODO);

    //router
    const router = useRouter();

    if(loading){
        return (
            <div className="title">Loading.....</div>
        );
    }

    const todos = data?.todos;

    const handleView = (id: string | number) => {
        router.push(`/todo/${id}`)
    }
    
    const handleEdit = (id: string | number) => {
        router.push(`/todo/${id}?type=edit`)
    }

    const handleDelete = async (id: string | number) => {

        try {
            const {data} = await deleteTodo({variables: {
                id
            }})

            alert('Successfully deleted the todo');

            refetch();

        } catch(e: any) {
            return ('Issue with creating the todo');
        }
    }
    
  return (
    <div className="todos-section card">
    <div className="todos-header">
        <div className="title">Todos !!</div>
        <div className="create-todos-btn">
            <Link href='/new'>+ new todo</Link>
        </div>
    </div>
    <div className="todos-container">
        <div className="todo-cards">
            {!loading && todos.map((todo: any) => (
            <div className="todo-card">
                <div className="todo-details">
                    <div className="todo-created">{todo.dueDate}</div>
                    <div className="todo-name">{todo.name}</div>
                </div>
                <div className="todo-status">
                    {todo.completed ?
                    
                    <div className="status completed">
                        completed
                    </div> :
                    <div className="status in-progress">
                        In progress
                    </div>}
                </div>
                <div className="todo-actions">
                    <div onClick={() => handleView(todo.id)} className="action view">
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    <div onClick={() => handleEdit(todo.id)} className="action edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div onClick={() => handleDelete(todo.id)} className="action delete">
                        <i className="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
        ))}
        </div>
    </div>
</div>
)
}

export default todos