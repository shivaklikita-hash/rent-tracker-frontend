import React, {useState} from 'react';
import API, { setToken } from '../api';

export default function Login({onLogin}){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  async function doLogin(e){
    e.preventDefault();
    const fd = new URLSearchParams();
    fd.append('username', email);
    fd.append('password', password);
    try{
      const res = await API.post('/auth/token', fd);
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      onLogin();
    }catch(err){
      alert('Login failed. If first time, register via API or ask me to add register UI.');
    }
  }

  return (
    <div className="center card">
      <h2>Rent Tracker</h2>
      <form onSubmit={doLogin}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit" className="btn">Login</button>
      </form>
      <p className="muted">First time? Use Register from backend API or ask me to add Register UI.</p>
    </div>
  );
}
