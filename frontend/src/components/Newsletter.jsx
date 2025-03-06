import React from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Form Submitted");
    toast.success("Form Submitted Successfully");
  };

  return (
    <div className="w-4/5  mx-auto flex flex-col justify-center items-center bg-gray-100 shadow-xl  my-10 p-10">
      <p className="text-3xl font-semibold pb-5 ">
        Subscribe now & get 20% off
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-400">
        Sign up today and enjoy 20% off your first purchase—exclusive deals
        await!
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 flex-1 flex items-center justify-center  my-5"
      >
        <input
          type="email"
          placeholder="Enter your email "
          className=" w-full flex-1/3 bg-gray-50 outline-none sm:px-6 px-3 py-1.5 sm:py-3"
          required
        />
        <button
          type="submit"
          className="text-md bg-black text-white sm:px-6 sm:py-3 py-1.5 px-3 hover:cursor-pointer hover:bg-gray-900"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
