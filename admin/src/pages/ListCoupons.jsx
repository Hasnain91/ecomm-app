import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";
import { Trash, Pencil } from "lucide-react";
import { getAllCoupons, deleteCoupon } from "../api/endpoints";

const ListCoupons = ({ token }) => {
  const navigate = useNavigate();

  const [couponList, setCouponList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await getAllCoupons(token);

      if (res.data.success) {
        console.log("Coupons from db:");
        console.log(res.data.coupons);
        setCouponList(res.data.coupons);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetching coupons: ", error);
      toast.error(error?.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const removeCoupon = async () => {
    if (!selectedCoupon) return;
    try {
      const res = await deleteCoupon(selectedCoupon._id, token);

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCoupons();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in removing coupon: ", error);
      toast.error(error?.message || "Failed to delete coupon");
    }
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-semibold">All Coupons</p>

        {/* Add Coupon Button */}
        <button
          onClick={() => navigate("/add-coupon")}
          className="bg-gray-900 text-gray-100 px-3 py-2 cursor-pointer rounded hover:opacity-70"
        >
          Add New Coupon
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* List table Title */}
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-base">
          <b>Code</b>
          <b>Discount Type</b>
          <b>Value</b>
          <b>Status</b>
          <b>Expiry Date</b>
          <b className="text-center">Action</b>
        </div>

        {/* Coupons List */}
        {couponList.length > 0 ? (
          couponList.map((coupon, index) => (
            <div
              className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-base"
              key={index}
            >
              <p>{coupon.code}</p>
              <p>{coupon.discountType}</p>
              <p>{coupon.discountValue}</p>
              <p>{coupon.isActive ? "Active" : "Not Active"}</p>
              <p>{new Date(coupon.expiryDate).toLocaleDateString()}</p>
              <div className="flex justify-center gap-3 place-self-center">
                <p
                  onClick={() => navigate(`/edit-coupon/${coupon._id}`)}
                  className="text-green-400 cursor-pointer text-lg font-bold"
                >
                  <Pencil />
                </p>
                <p
                  onClick={() => handleDeleteClick(coupon)}
                  className="text-red-400 cursor-pointer text-lg font-bold"
                >
                  <Trash />
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No coupons found.</p>
        )}
      </div>

      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-lg">Are you sure you want to delete this coupon?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md mr-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={removeCoupon}
            className="px-4 py-2 bg-red-500 text-lg font-medium text-gray-50 hover:bg-red-600 rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </>
  );
};

export default ListCoupons;
