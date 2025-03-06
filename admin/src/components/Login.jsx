import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { backendUrl } from "../constants";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
      } else {
        toast.error(res?.message);
        console.log(res);
      }

      //   setEmail("");
      //   setPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 min-w-72">
            <p className="text-base font-medium text-gray-700 mb-3">
              Email Address
            </p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              value={email}
              type="email"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-base font-medium text-gray-700 mb-3">Password</p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password "
              value={password}
              type="password"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full px-4 py-2 rounded-md text-lg font-semibold tracking-wider text-white bg-black cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
