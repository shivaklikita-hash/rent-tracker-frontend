import React, { useState } from "react";
import API, { setToken } from "../api";
import Register from "./Register";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (showRegister) {
    return <Register onRegistered={() => setShowRegister(false)} />;
  }

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await API.post("/auth/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = res.data.access_token;

      localStorage.setItem("token", token);
      setToken(token);
      onLogin();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f1fafb",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Rent Tracker
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={buttonStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p
            style={{
              color: "#c0392b",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          First time?{" "}
          <span
            style={{ color: "#0aa1a4", cursor: "pointer" }}
            onClick={() => setShowRegister(true)}
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#0aa1a4",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Login;
