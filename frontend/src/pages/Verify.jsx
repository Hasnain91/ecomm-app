import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../constants";
import { verifyPayment as verifyPaymentAPI } from "../api/endpoints";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate("/login");
        toast.error("Please log in to verify your payment.");
        return null;
      }

      const paymentData = { success, orderId };

      const res = await verifyPaymentAPI(paymentData, token);

      if (res.data.success) {
        dispatch({ type: "cart/clearCart" });
        navigate("/orders");
        toast.success("Payment verified successfully!");
      } else {
        navigate("/cart");
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.log("Error verifying payment:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div></div>;
};

export default Verify;
