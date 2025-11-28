import React, {useState} from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App(){
  const token = localStorage.getItem('token');
  const [auth, setAuth] = useState(!!token);
  return auth ? <Dashboard onLogout={()=>{localStorage.removeItem('token'); setAuth(false)}} /> : <Login onLogin={()=>setAuth(true)} />;
}

export default App;
