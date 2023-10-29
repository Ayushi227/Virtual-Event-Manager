import React, { useState } from "react";
import "../index.css";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

const Register = () => {
  const roles = ["admin", "user"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(username, email, password, role);
  };

  return (
    <div>
      <div className="background-image"></div>
      <div className="container centered signup">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select
              value={role|| ""}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button className="button" disabled={isLoading}>
            Sign Up
          </button>
          {error && <div className="error"> {error} </div>}
          <Link className="registrationLink" to="/login">Already have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
