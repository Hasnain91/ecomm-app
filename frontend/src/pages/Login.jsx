import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/endpoints";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (!data.email || !data.password) return;

    if (currentState === "Sign Up" && !data.name) {
      toast.error("Name is required");
      return;
    }

    const request =
      currentState === "Sign Up"
        ? registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
          })
        : loginUser({ email: data.email, password: data.password });

    toast
      .promise(request, {
        loading:
          currentState === "Sign Up" ? "Registering..." : "Logging in...",
        success: (
          <em>
            {currentState === "Sign Up"
              ? "Registration Successful!"
              : "Login Successful!"}
          </em>
        ),
        error: (err) => (
          <b>{err?.response?.data?.message || "Something went wrong"}</b>
        ),
      })
      .then((res) => {
        if (res.data.success) {
          dispatch({ type: "auth/setToken", payload: res.data.token });
          dispatch({ type: "auth/setUser", payload: res.data.userId });
          reset();
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error in Signing Up/Login:", error);
      });
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-xl m-auto mt-14 gap-4 text-gray-800 border-2 p-14"
      data-aos="zoom-in"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-10 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <>
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 border border-gray-800"
          />
          {errors.name && (
            <p className="text-red-500 w-full text-base -mt-2">
              {errors.name.message}
            </p>
          )}
        </>
      )}

      <input
        type="email"
        placeholder="Email Address"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
        className="w-full px-3 py-2 border border-gray-800"
      />
      {errors.email && (
        <p className="text-red-500 w-full text-base -mt-2">
          {errors.email.message}
        </p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        })}
        className="w-full px-3 py-2 border border-gray-800"
      />
      {errors.password && (
        <p className="text-red-500 w-full text-base -mt-2">
          {errors.password.message}
        </p>
      )}

      {/* Additional Links */}
      <div className="w-full flex justify-between mt-[-8px] text-sm">
        <p className="cursor-pointer sm:text-lg hover:underline text-gray-600">
          Forgot your password?
        </p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer sm:text-lg hover:underline"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create your account
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

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-black text-white text-lg font-medium px-8 py-2 mt-4 hover:text-gray-800 hover:bg-gray-200"
      >
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
