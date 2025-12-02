import React, { useState } from "react";
import API from "../api";
import Register from "./Register";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // Show Register UI instead of Login
  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/token", {
        username: email,
        password: password,
      });

      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch (err) {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Rent Tracker</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={buttonStyle}>
          Login
        </button>

        {message && <p style={{ color: "red" }}>{message}</p>}

        <p style={{ marginTop: 15, textAlign: "center" }}>
          First time?
          <span
            style={{ color: "#0aa1a4", cursor: "pointer", marginLeft: 6 }}
            onClick={() => setShowRegister(true)}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f1fafb",
};

const card = {
  width: "420px",
  padding: "30px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#0aa1a4",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};
