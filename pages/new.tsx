import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

// Set up Apollo Client
const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
});

const CREATE_TODO_MUTATION = gql`
  mutation CreateTodo($name: String!, $description: String!, $dueDate: String!, $userId: ID!) {
    createTodo(name: $name, description: $description, dueDate: $dueDate, userId: $userId) {
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



const NewTodo = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const [createTodo] = useMutation(CREATE_TODO_MUTATION);

    const router = useRouter();

    const handleCreateTodo = async (e: any) => {
        e.preventDefault();

        try {
            const { data } = await createTodo({
                variables: {
                  name: title,
                  description,
                  dueDate: date,
                  userId: "2",
                },
            });

            setTitle('')
            setDescription('')
            setDate('')

            if(data.createTodo.id){
                router.push(`/todo/${data.createTodo.id}`)
            }
        
        } catch(e: any) {
            return ('Issue with creating the todo');
        }
    }

    return (
        <>
        <div className="todo-section card">
            <div className="title">New Todo</div>
            <div className="todo-content">
                <div className="todo-editor">
                    <div className="form-container">
                        <form onSubmit={(e) => handleCreateTodo(e)}>
                            <div className="form-div title-div">
                                <label>Title</label>
                                <input className="title-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="form-div description">
                                <label>Description</label>
                                <input className="description-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="form-div due-date">
                                <label>Due date</label>
                                <input type="date" className="duedate" value={date} onChange={(e) => setDate(e.target.value)} />
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
