import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkPasswordStrength = (pwd) => {
    if (pwd.length > 9) {
      setPasswordStrength("Strong");
    } else if (pwd.length > 5) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/register", { username, email, password });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error registering user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-gradient-to-tr from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          Create Account
        </h2>

        {/* Username */}
        <label className="mb-2 font-semibold text-indigo-700">Username</label>
        <input
          className="w-full p-4 mb-6 rounded-xl border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition duration-300 text-gray-900 placeholder-indigo-400"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={20}
        />

        {/* Email */}
        <label className="mb-2 font-semibold text-indigo-700">
          Email Address
        </label>
        <input
          className="w-full p-4 mb-6 rounded-xl border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition duration-300 text-gray-900 placeholder-indigo-400"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="mb-2 font-semibold text-indigo-700 flex justify-between items-center">
          Password
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-indigo-600 hover:text-indigo-900 transition select-none font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </label>
        <input
          className="w-full p-4 mb-1 rounded-xl border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition duration-300 text-gray-900 placeholder-indigo-400"
          placeholder="Create a strong password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
          required
          minLength={6}
        />
        <p
          className={`mb-6 font-semibold ${
            passwordStrength === "Strong"
              ? "text-green-600"
              : passwordStrength === "Medium"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          Password Strength: {passwordStrength || "—"}
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 text-white font-extrabold shadow-lg hover:shadow-pink-500/60 hover:scale-105 transform transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Or divider */}
        <div className="flex items-center my-8 text-gray-500">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 select-none">or continue with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-700 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
