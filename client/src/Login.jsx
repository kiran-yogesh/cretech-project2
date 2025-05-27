import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 rounded-xl"
        >
          Login
        </button>

        <p className="text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
