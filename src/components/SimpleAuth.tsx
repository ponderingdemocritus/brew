import React, { useState } from "react";
import { signInWithEmail } from "../services/authService";

interface SimpleAuthProps {
  onAuthSuccess: () => void;
}

const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      onAuthSuccess();
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    maxWidth: "28rem",
    margin: "0 auto",
    border: "1px solid #e5e1d9",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#3c3027",
    textAlign: "center",
    fontFamily: "'Playfair Display', serif",
  };

  const errorStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fee2e2",
    borderLeftWidth: "4px",
    borderLeftColor: "#ef4444",
    color: "#b91c1c",
    borderRadius: "0.25rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "0.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e5e1d9",
    borderRadius: "0.25rem",
    transition: "all 0.2s ease",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#8c7851",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const spinnerStyle: React.CSSProperties = {
    height: "1.25rem",
    width: "1.25rem",
    borderRadius: "9999px",
    borderBottom: "2px solid white",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Simple Login</h2>

      {error && (
        <div style={errorStyle}>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="your@email.com"
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? <div style={spinnerStyle}></div> : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SimpleAuth;
