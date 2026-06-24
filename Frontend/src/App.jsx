import './App.css'
import ChatWindow from './ChatWindow.jsx';
import Sidebar from './Sidebar.jsx';
import {MyContext} from './MyContext.jsx';

function App() {
  const providerValue = {};

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
