import React, { useState } from "react";
import CouponForm from "../components/CouponForm";
import toast from "react-hot-toast";
import { addCoupon } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const AddCoupon = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddCoupon = async (formData) => {
    try {
      setIsLoading(true);
      console.log("formData in AddCoupon: ", formData);
      const res = await addCoupon(formData, token);
      if (res.data.success) {
        toast.success("Coupon added successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error(error.response?.data?.message || "Failed to add coupon");
    } finally {
      setIsLoading(false);
      navigate("/coupons");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Coupon</h1>
      <CouponForm onSubmit={handleAddCoupon} isLoading={isLoading} />
    </div>
  );
};

export default AddCoupon;
