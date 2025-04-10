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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <p className="text-xl font-semibold text-gray-800">All Coupons</p>

        {/* Add Coupon Button */}
        <button
          onClick={() => navigate("/add-coupon")}
          className="mt-4 md:mt-0 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          Add New Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="flex flex-col gap-4">
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-medium text-gray-700">
          <b>Code</b>
          <b>Discount Type</b>
          <b>Value</b>
          <b>Status</b>
          <b>Expiry Date</b>
          <b className="text-center">Action</b>
        </div>

        {/* Coupons List Items */}
        {couponList.length > 0 ? (
          couponList.map((coupon, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] grid-cols-1 gap-4 py-4 px-4 border rounded-md shadow-sm bg-white text-sm text-gray-700"
              data-aos="zoom-in"
            >
              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-2">
                <p>
                  <span className="font-medium">Code:</span> {coupon.code}
                </p>
                <p>
                  <span className="font-medium">Discount Type:</span>{" "}
                  {coupon.discountType}
                </p>
                <p>
                  <span className="font-medium">Value:</span>{" "}
                  {coupon.discountValue}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {coupon.isActive ? "Active" : "Not Active"}
                </p>
                <p>
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/edit-coupon/${coupon._id}`)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(coupon)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              {/* Desktop View */}
              <p className="hidden md:block">{coupon.code}</p>
              <p className="hidden md:block">{coupon.discountType}</p>
              <p className="hidden md:block">{coupon.discountValue}</p>
              <p className="hidden md:block">
                {coupon.isActive ? "Active" : "Not Active"}
              </p>
              <p className="hidden md:block">
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </p>
              <div className="hidden md:flex justify-center gap-3">
                <button
                  onClick={() => navigate(`/edit-coupon/${coupon._id}`)}
                  className="text-green-500 hover:text-green-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(coupon)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No coupons found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg md:text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-sm md:text-base">
          Are you sure you want to delete this coupon?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-sm md:text-base font-medium hover:bg-gray-300 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={removeCoupon}
            className="px-4 py-2 bg-red-500 text-sm md:text-base font-medium text-gray-50 hover:bg-red-600 rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </>
  );
};

export default ListCoupons;
