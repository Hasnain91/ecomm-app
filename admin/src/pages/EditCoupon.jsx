import React, { useState, useEffect } from "react";
import CouponForm from "../components/CouponForm";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getCoupon, updateCoupon } from "../api/endpoints";

const EditCoupon = ({ token }) => {
  const { id } = useParams(); // Get coupon ID from URL
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing coupon data
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await getCoupon(id, token);

        axios.get(`/api/coupon/${id}`);
        if (res.data.success) {
          setCoupon(res.data.coupon);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching coupon:", error);
        toast.error(error.response?.data?.message || "Failed to fetch coupon");
      }
    };
    fetchCoupon();
  }, [id]);

  const handleUpdateCoupon = async (formData) => {
    try {
      setIsLoading(true);
      const res = await updateCoupon(id, formData, token);

      if (res.data.success) {
        toast.success("Coupon updated successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to update coupon");
    } finally {
      setIsLoading(false);
      navigate("/coupons");
    }
  };

  if (!coupon) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Coupon</h1>
      <CouponForm
        initialData={coupon}
        onSubmit={handleUpdateCoupon}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditCoupon;
