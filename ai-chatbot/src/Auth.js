import React, { useState } from "react";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP login (backend later)
    onLogin({ email });
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} style={styles.switch}>
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#121212",
    color: "white"
  },
  box: {
    padding: "30px",
    background: "#1e1e1e",
    borderRadius: "10px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#19c37d",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  },
  switch: {
    marginTop: "10px",
    cursor: "pointer",
    color: "#19c37d"
  }
};

export default Auth;