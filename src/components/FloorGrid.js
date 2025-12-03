import React, { useEffect, useState } from "react";
import API from "../api";

export default function FloorGrid({ buildingId }) {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    fetchFloors();
  }, []);

  async function fetchFloors() {
    const res = await API.get(`/floors?building_id=${buildingId}`);
    setFloors(res.data || []);
  }

  async function addFloor() {
    const num = prompt("Enter floor number:");
    if (!num) return;
    await API.post("/floors", {
      building_id: buildingId,
      floor_number: parseInt(num),
    });
    fetchFloors();
  }

  async function deleteFloor(floorId) {
    if (!window.confirm("Delete this floor? Rooms will also be deleted.")) return;
    await API.delete(`/floors/${floorId}`);
    fetchFloors();
  }

  async function deleteBuilding() {
    if (!window.confirm("Delete entire building? All floors & rooms will be removed.")) return;
    await API.delete(`/buildings/${buildingId}`);
    setFloors([]);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏢 Building Overview</h2>

      <button className="add-floor" onClick={addFloor}>➕ Add Floor</button>

      {floors.map(f => (
        <SingleFloor key={f.id} floor={f} onDelete={deleteFloor} />
      ))}

      <button className="delete-building" onClick={deleteBuilding}>🗑 Delete Building</button>
    </div>
  );
}

function SingleFloor({ floor, onDelete }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const res = await API.get(`/rooms?floor_id=${floor.id}`);
    setRooms(res.data || []);
  }

  async function addRoom() {
    const num = prompt("Room number (e.g. 101)");
    if (!num) return;
    await API.post("/rooms", { floor_id: floor.id, room_number: num });
    fetchRooms();
  }

  return (
    <div className="floor-box">
      <div className="floor-header">
        <h4>Floor {floor.floor_number}</h4>

        <button
          className="delete-floor"
          onClick={() => onDelete(floor.id)}
        >
          🗑
        </button>
      </div>

      <div className="grid">
        {rooms.map((r) => (
          <div
            key={r.id}
            className={`room ${r.last_status || "pending"}`}
            onClick={() => alert("Open room modal (will implement next)")}
          >
            <div>{r.room_number}</div>
          </div>
        ))}

        <div className="room add" onClick={addRoom}>+ Add</div>
      </div>
    </div>
  );
}
