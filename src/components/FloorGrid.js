import React, { useEffect, useState } from "react";
import API from "../api";

export default function FloorGrid({ buildingId }) {
  const [floors, setFloors] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchFloors();
  }, []);

  async function fetchFloors() {
    try {
      const res = await API.get(`/floors?building_id=${buildingId}`);
      setFloors(res.data || []);
    } catch (err) {
      console.error("Error loading floors", err);
    }
  }

  async function addFloor() {
    const num = prompt("Enter floor number:");
    if (!num) return;

    try {
      await API.post("/floors", {
        building_id: buildingId,
        floor_number: parseInt(num),
      });
      fetchFloors();
    } catch (err) {
      alert("Failed to add floor");
    }
  }

  async function deleteFloor(floorId) {
    if (!window.confirm("Delete this floor? Rooms under this floor will also be removed.")) return;

    try {
      await API.delete(`/floors/${floorId}`);
      fetchFloors();
    } catch (err) {
      alert("Failed to delete floor");
    }
  }

  async function deleteBuilding() {
    if (!window.confirm("Delete ENTIRE building? This will delete all floors + rooms.")) return;

    try {
      await API.delete(`/buildings/${buildingId}`);
      setFloors([]);
    } catch (err) {
      alert("Failed to delete building");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="header-row">
        <h2>🏢 Building Overview</h2>
        <button className="btn small" onClick={addFloor}>➕ Add Floor</button>
      </div>

      {floors.length === 0 && (
        <p style={{ color: "#666", marginTop: "10px" }}>No floors yet. Add one!</p>
      )}

      {floors.map((f) => (
        <SingleFloor 
          key={f.id} 
          floor={f} 
          onDelete={deleteFloor} 
          onRoomSelect={setSelectedRoom} 
        />
      ))}

      <button className="btn danger" onClick={deleteBuilding}>
        🗑 Delete Building
      </button>

      {/* Room Modal will be added later */}
      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Room {selectedRoom.room_number}</h3>
            <p>Payment modal coming next…</p>

            <button className="btn" onClick={() => setSelectedRoom(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SingleFloor({ floor, onDelete, onRoomSelect }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const res = await API.get(`/rooms?floor_id=${floor.id}`);
      setRooms(res.data || []);
    } catch (err) {
      console.error("Error loading rooms", err);
    }
  }

  async function addRoom() {
    const num = prompt("Room number (e.g., 101)");
    if (!num) return;

    try {
      await API.post("/rooms", { floor_id: floor.id, room_number: num });
      fetchRooms();
    } catch (err) {
      alert("Failed to add room");
    }
  }

  return (
    <div className="floor-box">
      <div className="floor-header">
        <h3>🏬 Floor {floor.floor_number}</h3>
        <button className="delete-floor" onClick={() => onDelete(floor.id)}>🗑</button>
      </div>

      <div className="grid">
        {rooms.map((r) => (
          <div
            key={r.id}
            className={`room ${r.last_status || "pending"}`}
            onClick={() => onRoomSelect(r)}
          >
            {r.room_number}
          </div>
        ))}

        <div className="room add" onClick={addRoom}>+ Add</div>
      </div>
    </div>
  );
}
