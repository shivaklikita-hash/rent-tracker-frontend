import React, { useState } from "react";
import API from "../api";

export default function RoomModal({ room, onClose, onSaved }) {
  const [amount, setAmount] = useState("");
  const [advance, setAdvance] = useState("");
  const [note, setNote] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  async function savePayment() {
    if (!amount) {
      alert("Enter amount collected");
      return;
    }

    setLoading(true);

    try {
      await API.post("/payments", {
        room_id: room.id,
        month,
        year,
        amount_collected: parseFloat(amount),
        advance_used: parseFloat(advance || 0),
        note,
      });

      setLoading(false);
      onSaved();     // refresh rooms in FloorGrid
      onClose();     // close modal
    } catch (e) {
      console.error(e);
      alert("Failed to save payment");
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Record Payment — Room {room.room_number}</h3>

        <label>Amount Collected</label>
        <input
          className="input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Advance Used</label>
        <input
          className="input"
          type="number"
          value={advance}
          onChange={(e) => setAdvance(e.target.value)}
        />

        <label>Month</label>
        <select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <label>Year</label>
        <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <label>Notes</label>
        <textarea
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <div className="modal-buttons">
          <button className="btn" onClick={savePayment} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
