import React, {useEffect, useState} from 'react';
import API, { setToken } from '../api';
import FloorGrid from './FloorGrid';

export default function Dashboard({onLogout}){
  const token = localStorage.getItem('token');
  if(token) setToken(token);
  const [buildings, setBuildings] = useState([]);

  useEffect(()=>{ fetchBuildings() }, []);
  async function fetchBuildings(){
    try{ const res = await API.get('/buildings'); setBuildings(res.data||[]); }catch(e){ console.error(e); }
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>Rent Tracker</h1>
        <div>
          <button className="btn ghost" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main>
        <div className="actions">
          <button className="btn" onClick={async ()=>{ const name = prompt('Building name?'); if(!name) return; await API.post('/buildings', {name}); fetchBuildings(); }}>Add Building</button>
        </div>

        <div className="cards">
          {buildings.map(b=> (
            <div key={b.id} className="card building">
              <div className="card-head">
                <h3>{b.name}</h3>
                <div className="meta">ID: {b.id && b.id.substring(0,6)}</div>
              </div>
              <div className="card-body">
                <button className="btn small" onClick={async ()=>{ const floors = parseInt(prompt('Number of floors (e.g. 2)')); if(!floors) return; for(let i=1;i<=floors;i++){ await API.post('/floors', {building_id: b.id, floor_number: i}); } alert('Floors added. Refreshing...'); }}>Add Floors</button>
                <FloorGrid buildingId={b.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
