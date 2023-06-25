import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// Set up Apollo Client
const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
});

const Todo = () => {
    //get query id
    const router = useRouter();
    const id = router.query.id;

    //get search params
    const params = useSearchParams();
    const type = params.get('type')
    console.log(type)

    //Query
    const GET_TODO = gql`
    {
        todo(id: ${id}) {
        id,
        name,
        description,
        completed,
        dueDate,
        tomatoesConsumed
        }
    }
    `;

    const {loading, error, data} = useQuery(GET_TODO);

    if(loading){
        return('Loading...');
    }

    if(error){
        return ('Todo not found.....');
    }

    const todo = data.todo;

  return (
<div className="todo-section card">
    {!loading && data ? <>
    <div className="todo-start">
    Start Todo
</div>
<div className="todo-timer hide">
<div className="count">
    <span className="minutes">25</span> : <span className="seconds">00</span>
</div>
<div className="timer-actions">
    <div className="pause">
        <i className="fa-solid fa-pause"></i>
        <i className="fa-solid fa-play"></i>
    </div>
    <div className="stop">
        <i className="fa-solid fa-stop"></i>
    </div>
</div>
</div>
<div className="title">
Todo: {todo.name}
</div>
<div className="todo-content">
<div className="todo-details">
    <div className="created">Due Date: {todo.dueDate}</div>
    <div className="tomatoes"><i className="fa-solid fa-apple-whole"></i>: {todo.tomatoesConsumed}</div>
</div>
<div className="todo-editor">
    <div className="form-container">
        <form>
            <div className="form-div title-div">
                <label>Title</label>
                <input className="title-input" type="text" value={todo.name} disabled={type == 'edit' ? false : true} />
            </div>
            <div className="form-div description">
                <label>description</label>
                <input className="description-input" type="text" value={todo.description} disabled={type == 'edit' ? false : true} />
            </div>
            <div className="form-div due-date">
                <label>Due date</label>
                <input type="date" className="duedate" value={todo.dueDate}  disabled={type == 'edit' ? false : true} />
            </div>
            <div className="form-div form-cta update hide">
                <input type="submit" value="update" disabled={type == 'edit' ? false : true} />
            </div>
            <div className="form-div form-cta complete">
                <input className="complete" type="submit" value="mark complete" disabled={type == 'edit' ? false : true} />
            </div>
        </form>
    </div>
</div>
</div> </> : 'Todo not found'
}
        
</div>
  )
}

export default Todo