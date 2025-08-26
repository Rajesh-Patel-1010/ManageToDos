import React, { useState } from "react";

interface LoginProps {
  onLogin: (username: string, password: string, email?: string) => void;
  onSwitchMode: () => void;
  isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchMode, isRegisterMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || (isRegisterMode && !email)) {
      setError(isRegisterMode ? "Please enter username, email, and password." : "Please enter both username and password.");
      return;
    }
    setError("");
    onLogin(username, password, isRegisterMode ? email : undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      {isRegisterMode && (
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
      )}
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">{isRegisterMode ? "Register" : "Login"}</button>
      <button type="button" onClick={onSwitchMode} style={{ marginLeft: 8 }}>
        {isRegisterMode ? "Switch to Login" : "Switch to Register"}
      </button>
    </form>
  );
};

export default Login; 