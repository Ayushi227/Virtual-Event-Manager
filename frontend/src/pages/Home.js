import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="background-image"></div>
      <div className="container centered login">
        <h1>Welcome to the Event Management System</h1>
        <Link to="/login" className="button">
          Login
        </Link>
        <Link to="/signup" className="button">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
