import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Validation error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");

    // Validation checks
    let isValid = true;

    if (currentState === "Sign Up" && !name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setIsLoading(true);
      if (currentState === "Sign Up") {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Registration Successful");
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Login Successful");
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log("Error in Signing Up: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-10 bg-gray-800" />
        </div>

        {currentState === "Login" ? (
          " "
        ) : (
          <>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
                setNameError(""); // Clear error on input change
              }}
              value={name}
            />
            {nameError && (
              <p className="text-red-500 w-full text-base -mt-2">{nameError}</p>
            )}
          </>
        )}
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email Address"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(""); // Clear error on input change
          }}
          value={email}
        />
        {emailError && (
          <p className="text-red-500 w-full text-base -mt-2">{emailError}</p>
        )}
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(""); // Clear error on input change
          }}
          value={password}
        />
        {passwordError && (
          <p className="text-red-500 w-full text-base -mt-2">{passwordError}</p>
        )}

        <div className="w-full flex justify-between mt-[-8px] text-sm">
          <p className="cursor-pointer sm:text-lg hover:underline text-gray-600">
            Forgot your password?
          </p>
          {currentState === "Login" ? (
            <p
              className="cursor-pointer sm:text-lg hover:underline"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create your account{" "}
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer sm:text-lg hover:underline"
            >
              Login to your account
            </p>
          )}
        </div>
        <button className="bg-black text-white text-lg font-medium px-8 py-2 mt-4 hover:text-gray-800 hover:bg-gray-200">
          {currentState === "Login"
            ? `${isLoading ? "Signing In..." : "Sign In"}`
            : `${isLoading ? "Signing Up..." : "Sign Up"}`}
        </button>
      </form>
    </>
  );
};

export default Login;
