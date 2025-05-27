// Main App Logic Here
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import TodoApp from "./TodoApp";

axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token;
  }, [token]);

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoApp setToken={setToken} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
