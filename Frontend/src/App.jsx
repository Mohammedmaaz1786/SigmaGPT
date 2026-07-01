import './App.css'
import ChatWindow from './ChatWindow.jsx';
import Sidebar from './Sidebar.jsx';
import {MyContext} from './MyContext.jsx';
import { useState } from 'react';
import {v1 as uuid} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [currthreadId, setCurrThreadId] = useState(uuid());
  const [prevChats, setPrevChats] = useState([]);//stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);//to check if new chat is created or not
  const [allThreads, setAllThreads] = useState([]);//stores all threads

  const providerValue = {prompt, setPrompt, reply, setReply, currthreadId, setCurrThreadId, prevChats, setPrevChats, newChat, setNewChat, allThreads, setAllThreads};

  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
      <Sidebar />
      <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
