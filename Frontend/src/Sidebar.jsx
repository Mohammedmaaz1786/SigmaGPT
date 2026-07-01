import React from 'react';
import './Sidebar.css';
import { useContext } from 'react';
import { MyContext } from './MyContext.jsx';
import { useEffect } from 'react';
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads,currthreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats, user, handleLogout, token } = useContext(MyContext);

    const getAllThreads=async()=>{
        if(!token) return;

        try{
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (response.ok && Array.isArray(data)) {
                const mappedData = data.map((thread) => ({threadId: thread.threadId, title: thread.title}));
                setAllThreads(mappedData);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    };

    useEffect(()=>{
        getAllThreads();
    },[currthreadId, token]);

    const createNewChat=()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());//generating new threadId for new chat
        setPrevChats([]);
    }

    const changeThread=async(newThreadId)=>{
        setCurrThreadId(newThreadId);
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPrevChats(data);
            setNewChat(false);
            setReply(null);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const deleteThread=async(threadId)=>{
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`,{
                method:"DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            if(currthreadId===threadId)
            {
                createNewChat();
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally{
            getAllThreads();
        }
    }

    return (
        <section className='sidebar'>
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo'/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                {
                    allThreads?.map((thread,idx)=>(
                        <li key={idx}
                        onClick={()=>changeThread(thread.threadId)}
                        className={thread.threadId===currthreadId?"highlighted":""}
                        >
                        {thread.title}
                        <i class="fa-solid fa-trash"
                        onClick={(e)=>{
                            e.stopPropagation();
                            deleteThread(thread.threadId);
                        }}
                        ></i>
                        </li>
                    ))
                }
            </ul>

            <div className='sign'>
                <p>By Mohammed Maaz &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;