import React, { useContext, useState } from "react";
import CartTotal from "../components/CartTotal";
import { assets, baseUrl } from "../constants/index";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const {
  //   token,
  //   cartItems,
  //   setCartItems,
  //   getCartAmount,
  //   delivery_fee,
  //   products,
  // } = useContext(ShopContext);
  // Access global state using `useSelector`
  const token = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.products.list);
  const delivery_fee = useSelector((state) => state.config.deliveryFee);
  // // Calculate cart amount using Redux state
  const getCartAmount = (cartItems, products) => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const product = products[productId]; // Access product directly by ID
      if (!product) continue;

      for (const size in cartItems[productId]) {
        totalAmount += product.price * cartItems[productId][size];
      }
    }

    return totalAmount;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    if (!token) {
      navigate("/login");
      toast.error("Please log in to place your order");
      return;
    }

    try {
      let orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === productId)
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[productId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(cartItems, products) + delivery_fee,
      };

      switch (paymentMethod) {
        case "cod": {
          const res = await axios.post(
            `${baseUrl}/api/order/place-order-cod`,
            orderData,
            { headers: { token } }
          );

          if (res.data.success) {
            toast.success(res.data.message);
            dispatch({ type: "cart/clearCart" }); // Clear cart in Redux
            localStorage.removeItem("cart");
            navigate("/orders");
          } else {
            console.log("Error in COD case:", res.data?.error?.message);
            toast.error(res.data?.message);
          }
          break;
        }
        case "stripe": {
          const res = await axios.post(
            `${baseUrl}/api/order/place-order-stripe`,
            orderData,
            { headers: { token } }
          );

          if (res.data.success) {
            const { session_url } = res.data;
            dispatch({ type: "cart/clearCart" });
            localStorage.removeItem("cart");
            window.location.replace(session_url);
          } else {
            toast.error(res.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log("Error in placing order (handleSubmit):", error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500">
              DELIVERY
              <span className="text-gray-700 font-medium"> INFORMATION</span>
            </p>
            <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            {...register("firstName", { required: "First Name is required" })}
            type="text"
            placeholder="First Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            {...register("lastName", { required: "Last Name is required" })}
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex justify-between">
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
          {errors.lastName && (
            <p className="text-red-500 ">{errors.lastName.message}</p>
          )}
        </div>

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register("street", { required: "Street Address is required" })}
          type="text"
          placeholder="Street Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        {errors.street && (
          <p className="text-red-500">{errors.street.message}</p>
        )}

        <div className="flex gap-3">
          <input
            {...register("city", { required: "City is required" })}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            {...register("state", { required: false })}
            type="text"
            placeholder="State (Optional)"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}
        <div className="flex gap-3">
          <input
            {...register("country", { required: "Country is required" })}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            {...register("zipcode", {
              required: false,
            })}
            type="number"
            placeholder="Zip Code (Optional)"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        {errors.zipcode && (
          <p className="text-red-500">{errors.zipcode.message}</p>
        )}
        {errors.country && (
          <p className="text-red-500">{errors.country.message}</p>
        )}

        <input
          {...register("phone", {
            required: "Phone number is required",
          })}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      </div>

      {/* RIGHT Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-90">
          <CartTotal />
        </div>

        <div className="mt-12">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500">
              PAYMENT <span className="text-gray-700 font-medium">METHOD</span>
            </p>
            <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
          </div>

          {/* Payment methods selection */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div
              onClick={() => setPaymentMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-4.5 h-4.5 border rounded-full ${
                  paymentMethod === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                src={assets.stripe_logo}
                alt="Stripe Logo"
                className="h-5 mx-4"
              />
            </div>

            <div
              onClick={() => setPaymentMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-4.5 h-4.5 border rounded-full ${
                  paymentMethod === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-md font-medium">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-16 py-3 text-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-300 hover:text-black"
            >
              <div className="flex justify-between items-center gap-3 ">
                {isSubmitting ? "Placing Order" : "PLACE ORDER"}
                <Loader2
                  className={`${
                    isSubmitting ? "size-7 inline-flex animate-spin" : "hidden"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
