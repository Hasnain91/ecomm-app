import React, { useContext, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Newsletter = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${backendUrl}/api/mail/subscribe`, {
        email,
      });

      if (res.data.success) {
        toast("Subscription successful! Check your email.", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            fontSize: "22px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log("Error in handleSubmit of newsletter component: ", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
      setEmail("");
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email "
          className=" w-full flex-1/3 bg-gray-50 outline-none sm:px-6 px-3 py-1.5 sm:py-3"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="text-md bg-black text-white sm:px-6 sm:py-3 py-1.5 px-3 disabled:cursor-not-allowed disabled:opacity-40 hover:cursor-pointer hover:bg-gray-900"
        >
          {isLoading ? (
            <div className="flex justify-between items-center gap-2">
              <span className="text-lg">Subscribing</span>
              <LoaderIcon className="animate-spin size-7" />
            </div>
          ) : (
            "SUBSCRIBE"
          )}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
