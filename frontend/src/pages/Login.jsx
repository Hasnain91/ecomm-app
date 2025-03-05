import React, { useState } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
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
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email Address"
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between mt-[-8px] text-sm">
        <p className="cursor-pointer hover:underline text-gray-600">
          Forgot your password?
        </p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create your account{" "}
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer hover:underline"
          >
            Login to your account
          </p>
        )}
      </div>
      <button className="bg-black text-white text-lg font-medium px-8 py-2 mt-4 hover:text-gray-800 hover:bg-gray-200">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
