import './App.css'
import ChatWindow from './ChatWindow.jsx';
import Sidebar from './Sidebar.jsx';
import Auth from './Auth.jsx';
import {MyContext} from './MyContext.jsx';
import { useState, useEffect } from 'react';
import {v1 as uuid} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [currthreadId, setCurrThreadId] = useState(uuid());
  const [prevChats, setPrevChats] = useState([]);//stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);//to check if new chat is created or not
  const [allThreads, setAllThreads] = useState([]);//stores all threads
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setAllThreads([]);
    setPrevChats([]);
    setCurrThreadId(uuid());
    setNewChat(true);
    setShowAuthModal(true);
  };

  const providerValue = {
    prompt, setPrompt, 
    reply, setReply, 
    currthreadId, setCurrThreadId, 
    prevChats, setPrevChats, 
    newChat, setNewChat, 
    allThreads, setAllThreads,
    user, setUser,
    token, setToken,
    handleLogout,
    showAuthModal, setShowAuthModal
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
      <Sidebar />
      <ChatWindow />
      {showAuthModal && <Auth initialIsLogin={showAuthModal !== 'signup'} onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />}
      </MyContext.Provider>
    </div>
  )
}

export default App
