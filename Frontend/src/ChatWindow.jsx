import React from 'react';
import './ChatWindow.css';
import Chat from './Chat.jsx';
import {MyContext} from './MyContext.jsx';
import { useContext, useState,useEffect } from 'react';
import {ScaleLoader} from 'react-spinners';

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply,currthreadId,prevChats,setPrevChats,newChat,setNewChat, token, handleLogout, setShowAuthModal, user } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 

    const getReply=async()=>{
        if (!prompt) return; // Do not send empty prompts
        setLoading(true);
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currthreadId
            })
        };

        try{
            const response = await fetch("http://localhost:8080/api/chat",options);
            const data = await response.json();
            console.log(data);
            setReply(data.reply);
        }
        catch(err)
        {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    //Append new chat to previous
    useEffect(() => {
        if(reply && prompt) {
            setPrevChats(prev => (
                [...prev,{role:"user",content:prompt},
                    {role:"assistant",content:reply}]
            ))
            setPrompt(""); // Clear the prompt after adding it to chat history
            setNewChat(false);
        }  
    },[reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };


    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT<i className="fa-solid fa-angle-down"></i></span>
                {token ? (
                    <div className="userIconDiv" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button className="login-btn" onClick={() => setShowAuthModal('login')}>Log in</button>
                        <button className="signup-btn" onClick={() => setShowAuthModal('signup')}>Sign up</button>
                    </div>
                )}
            </div>
            {
                isOpen && token &&
                <div className="dropDown">
                    <div className="user-info">
                        <p className="username">{user?.username}</p>
                    </div>
                    <div className="dropDownItem"><i class="fa-solid fa-circle-up"></i> Upgrade Plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem" onClick={handleLogout}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder={token ? "Ask Anything..." : "Log in to chat"}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && token) {
                                getReply();
                            }
                        }
                    }
                    disabled={!token}
                    >
                    </input>
                    <div id="submit" onClick={token ? getReply : undefined} style={{ cursor: token ? 'pointer' : 'not-allowed', opacity: token ? 1 : 0.5 }}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
