// src/components/LoginSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://video-completion-tracker.onrender.com"
  const [isSignup, setIsSignup]   = useState(true);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const navigate                   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (isSignup) {
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }
    } else {
      if (!email || !password) {
        setError("Email & password are required.");
        return;
      }
    }

    setLoading(true);

    const userData = { email, password };
    if (isSignup) userData.name = name;

    const apiUrl = isSignup
    ?`${API_URL}/api/auth/signup`
:`${API_URL}/api/auth/login`;

    try {
      const { data } = await axios.post(apiUrl, userData);

      if (isSignup) {
        // After signup, switch to login mode
        setIsSignup(false);
        setName("");
        setPassword("");
        setError("Signup successful! Please log in.");
      } else {
        // On login, save token & redirect
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              (isSignup ? !name || !email || !password : !email || !password)
            }
            className={`w-full py-2 rounded-md font-semibold ${
              loading ||
              (isSignup ? !name || !email || !password : !email || !password)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
