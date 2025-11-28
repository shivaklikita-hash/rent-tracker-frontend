import React, {useEffect, useState} from 'react';
import API from '../api';

export default function FloorGrid({buildingId}){
  const [floors, setFloors] = useState([]);
  useEffect(()=> fetchFloors(), []);
  async function fetchFloors(){ const res = await API.get(`/floors?building_id=${buildingId}`); setFloors(res.data||[]); }

  return (
    <div>
      {floors.map(f => <SingleFloor key={f.id} floor={f} />)}
    </div>
  );
}

function SingleFloor({floor}){
  const [rooms, setRooms] = useState([]);
  useEffect(()=> fetchRooms(), []);
  async function fetchRooms(){ const res = await API.get(`/rooms?floor_id=${floor.id}`); setRooms(res.data||[]); }

  return (
    <div className="floor">
      <h4>Floor {floor.floor_number}</h4>
      <div className="grid">
        {rooms.map(r => (
          <div key={r.id} className={`room ${r.last_status||'pending'}`} onClick={()=> alert('Open room modal (to be implemented)')}>
            <div>{r.room_number}</div>
          </div>
        ))}
        <div className="room add" onClick={async ()=>{ const num = prompt('Room number (e.g. 101)'); if(!num) return; await API.post('/rooms', {floor_id: floor.id, room_number: num}); fetchRooms(); }}>+ Add</div>
      </div>
    </div>
  );
}
