import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const CouponForm = ({
  initialData = {}, // For editing, pass existing coupon data
  onSubmit,
  isLoading,
}) => {
  const [code, setCode] = useState(initialData.code || "");
  const [discountType, setDiscountType] = useState(
    initialData.discountType || "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    initialData.discountValue?.toString() || ""
  );
  const [minPurchase, setMinPurchase] = useState(
    initialData.minPurchase?.toString() || ""
  );
  const [expiryDate, setExpiryDate] = useState(
    initialData.expiryDate
      ? new Date(initialData.expiryDate).toISOString().split("T")[0]
      : ""
  );
  const [isActive, setIsActive] = useState(initialData.isActive || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      code: code.trim(),
      discountType,
      discountValue,
      minPurchase,
      expiryDate,
      isActive,
    };

    onSubmit(formData); // Pass the form data to the parent component
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
      {/* Coupon Code */}
      <div className="w-full mt-4">
        <p className="mb-2">Coupon Code</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="text"
          placeholder="Enter coupon code..."
          required
        />
      </div>

      {/* Discount Type */}
      <div className="w-full mt-4">
        <p className="mb-2">Discount Type</p>
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      {/* Discount Value */}
      <div className="w-full mt-4">
        <p className="mb-2">Discount Value</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          type="number"
          min={0}
          placeholder="Enter discount value..."
          required
        />
      </div>

      {/* Minimum Purchase */}
      <div className="w-full mt-4">
        <p className="mb-2">Minimum Purchase (Optional)</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
          value={minPurchase}
          onChange={(e) => setMinPurchase(e.target.value)}
          type="number"
          min={0}
          placeholder="Enter minimum purchase amount..."
        />
      </div>

      {/* Expiry Date */}
      <div className="w-full mt-4">
        <p className="mb-2">Expiry Date</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          type="date"
          required
        />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={(e) => setIsActive(e.target.checked)}
          checked={isActive}
          type="checkbox"
          id="isActive"
        />
        <label className="cursor-pointer" htmlFor="isActive">
          Coupon is Active
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`cursor-pointer flex justify-center items-center gap-2 w-45 py-3 mt-4 font-medium text-base bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {isLoading ? "Processing..." : "SUBMIT"}
        <LoaderCircle
          className={`${
            isLoading ? "size-4 inline-flex animate-spin" : "hidden"
          }`}
        />
      </button>
    </form>
  );
};

export default CouponForm;
