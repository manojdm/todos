import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from '@apollo/client';
import timerFunction from '../scripts/timer'

// Set up Apollo Client
const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
});

const Todo = () => {
    //refs
    const startTodoBtn = useRef<HTMLDivElement | null>(null);
    const timer = useRef<HTMLDivElement | null>(null);
    const pause = useRef<HTMLDivElement | null>(null);
    const play = useRef<HTMLDivElement | null>(null);

    //timer state
    const [running, setRunning] = useState(false)

    //get query id
    const router = useRouter();
    const id = router.query.id;

    //get search params
    const params = useSearchParams();
    const type = params.get('type')

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

    const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $completed: Boolean!) {
      updateTodo(id: $id, completed: $completed) {
        id
        name
        completed
        description
        dueDate
        tomatoesConsumed
      }
    }
  `;
  
  
    const {loading, error, data, refetch} = useQuery(GET_TODO);
    const [updateTodo] = useMutation(UPDATE_TODO);

        //Timer function
    const timerFunction = () => {
        const timer = document.querySelector('.timer');
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');

        //Pomodoro
        const pmaxMinutes = 24;

        //break
        const bmaxMinutes = 4;

        const minMinutes = 0;
        const minSeconds = 0;

        //time left
        let minLeft = 24;
        let secLeft = 0;

        //Total consumptions
        let pconsumed = 0;
        let bconsumed = 0;

        let current = 'pomodoro'

        if(current == 'pomodoro'){
            if(secLeft == 0){
                secLeft = 59
                minLeft -= 1
                if(minLeft == 0){
                    pconsumed += 1;
                    minLeft = bmaxMinutes;
                    current = 'break'
                }
                minutes.innerHTML = minLeft.toString().padStart(2, '0')

            } else {
                secLeft -=1
            }

            seconds.innerHTML=secLeft.toString().padStart(2, '0');

        } else {
            
            if(secLeft == 0){
                secLeft = 59
                minLeft -= 1
                if(minLeft == 0){
                    bconsumed += 1
                    minLeft = pmaxMinutes;
                    current = 'pomodoro'
                }
                minutes.innerHTML = minLeft.toString().padStart(2, '0')

            } else {
                secLeft -=1
            }

            seconds.innerHTML=secLeft.toString().padStart(2, '0');
        } 

    }


    useEffect(() => {
        if(running){
            if(play.current && pause.current){
                play.current.style.display = 'none';
                pause.current.style.display = 'block';
            }
            setInterval(timerFunction, 1000)
        } else {
            if(pause.current && play.current) {
                pause.current.style.display = 'none';
                play.current.style.display = 'block';
            }
        }
    },[running])

    if(loading){
        return('Loading...');
    }

    if(error){
        return ('Todo not found.....');
    }

    const todo = data.todo;

    //Mark complete Event listener
    const handleMarkComplete = async (e:any, id: string | number) => {
        e.preventDefault();

        try {
          const { data } = await updateTodo({
            variables: {
              id: String(id), // Convert id to string
              completed: true,
            },
          });
      
          if (data.updateTodo.completed) {
            refetch();
          }
        } catch (e: any) {
          return 'Issue with marking the todo complete';
        }
      };
      
      const handleStartTodo = () => {
        if (startTodoBtn.current && timer.current) {
          startTodoBtn.current.style.display = 'none';
          timer.current.style.display = 'block';
          setRunning(true)
        }
      };
      
      const handlePause = () => {
        setRunning(false)
      }

      const handlePlay = () => {
        setRunning(true)
      }
 
  return (
<div className="todo-section card">
    {!loading &&  data ? <>
{!todo.completed &&
<> <div ref={startTodoBtn} onClick={handleStartTodo} className="todo-start">
    Start Todo
</div>
<div ref={timer} className="todo-timer hide">
    <div className="count timer">
        <span className="minutes">25</span> : <span className="seconds"></span>
    </div>
    <div className="timer-actions">
        <div className="pause">
            <i onClick={handlePause} ref={pause}  className="fa-solid fa-pause"></i>
            <i onClick={handlePlay} ref={play} className="fa-solid fa-play"></i>
        </div>
        <div className="stop">
            <i className="fa-solid fa-stop"></i>
        </div>
    </div> 
</div> </>}
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
            {!todo.completed ?
            <div className="form-div form-cta complete">
                <input onClick={(e) => handleMarkComplete(e, todo.id)} className="complete" type="submit" value="mark complete" />
            </div>: ''}
        </form>
    </div>
</div>
</div> </> : 'Todo not found'
}
        
</div>
  )
}

export default Todo