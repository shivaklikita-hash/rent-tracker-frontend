import React, { useState } from "react";
import API from "../api";

export default function RoomModal({ room, onClose, refresh }) {
  const [amount, setAmount] = useState("");
  const [advance, setAdvance] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");

  async function savePayment() {
    try {
      await API.post("/payments", {
        room_id: room.id,
        month: Number(month),
        year: Number(year),
        status: amount >= room.rent_amount ? "paid" : amount === "0" ? "pending" : "partial",
        amount_collected: Number(amount),
        advance_used: Number(advance),
      });

      setMessage("Saved!");
      setTimeout(() => {
        refresh();
        onClose();
      }, 700);
    } catch (err) {
      setMessage("Error saving payment");
    }
  }

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <h3>Room {room.room_number}</h3>

        <label>Month</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)} style={input}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <label>Year</label>
        <input type="number" style={input} value={year} onChange={(e) => setYear(e.target.value)} />

        <label>Rent Paid</label>
        <input
          type="number"
          placeholder="Enter amount"
          style={input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Advance Used</label>
        <input
          type="number"
          placeholder="Enter advance"
          style={input}
          value={advance}
          onChange={(e) => setAdvance(e.target.value)}
        />

        <button onClick={savePayment} style={saveBtn}>Save</button>
        <button onClick={onClose} style={cancelBtn}>Cancel</button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

/* ---- Styles ---- */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  width: "350px",
  background: "#fff",
  padding: "18px",
  borderRadius: "10px",
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const saveBtn = {
  width: "100%",
  background: "#0aa1a4",
  color: "white",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  marginTop: "10px",
};

const cancelBtn = {
  width: "100%",
  background: "#ccc",
  marginTop: "6px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
};
