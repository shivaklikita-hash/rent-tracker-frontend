import React, { useState } from "react";
import API, { setToken } from "../api";
import Register from "./Register";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <Register onRegistered={() => setShowRegister(false)} />;
  }

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const res = await API.post("/auth/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = res.data.access_token;
      setToken(token);
      localStorage.setItem("token", token);

      onLogin();
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Rent Tracker</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "10px" }}>
        First time?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setShowRegister(true)}
        >
          Register Here
        </span>
      </p>
    </div>
  );
}

export default Login;
