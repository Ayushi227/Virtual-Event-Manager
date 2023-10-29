import React from "react";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
// import Navbar from "./components/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import MyProfile from "./pages/myProfile";



function App() {
  const { user } = useAuthContext()
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <div>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" /> : <Signup />}
          />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/myprofile"
            element={user ? <MyProfile /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
