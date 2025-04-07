import { useSelector } from "react-redux";
import { getCartAmount } from "../redux/features/cartSlice";

const CartTotal = ({ discountedTotal }) => {
  const currency = useSelector((state) => state.config.currency);
  const delivery_fee = useSelector((state) => state.config.deliveryFee);

  const cartTotal = useSelector((state) =>
    getCartAmount(state, state.products.list)
  );

  return (
    <div className="w-full">
      <div className="text-2xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            CART <span className="text-gray-700 font-medium">TOTAL</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}

            {cartTotal ? cartTotal.toFixed(2) : "0.00"}
          </p>
        </div>

        <hr />
        {/* 
        {!discountedTotal && (
          <div className="flex justify-between">
            <p>Discount</p>
            <p>0</p>
          </div>
        )} */}

        {discountedTotal ? (
          <div className="flex justify-between">
            <p>Discount</p>
            <p>
              -{currency}
              {(cartTotal - discountedTotal).toFixed(2)}
            </p>
          </div>
        ) : (
          <div className="flex justify-between">
            <p>Discount</p>
            <p>0</p>
          </div>
        )}
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {/* {(discountedTotal || 0) + delivery_fee} */}
            {/* {(cartTotal || 0) + delivery_fee}.00 */}
            {discountedTotal
              ? `${(discountedTotal || 0) + delivery_fee}.00`
              : `${(cartTotal || 0) + delivery_fee}.00`}
            {/* {(discountedTotal || 0) + delivery_fee}.00 */}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;

// import { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { getCartAmount } from "../redux/features/cartSlice";
// // import { applyCoupon } from "../../../admin/src/api/endpoints";
// import { baseUrl } from "../constants";

// const CartTotal = () => {
//   const currency = useSelector((state) => state.config.currency);
//   const delivery_fee = useSelector((state) => state.config.deliveryFee);

//   // Calculate cart total
//   const cartTotal = useSelector((state) =>
//     getCartAmount(state, state.products.list)
//   );

//   // State for coupon-related data
//   const [couponCode, setCouponCode] = useState(""); // Coupon code entered by the user
//   const [appliedCoupon, setAppliedCoupon] = useState(null); // Details of the applied coupon
//   const [discountedTotal, setDiscountedTotal] = useState(cartTotal); // Updated total after applying coupon
//   const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

//   // Handle coupon application
//   const handleApplyCoupon = async () => {
//     try {
//       setIsLoading(true);

//       const res = await axios.post(
//         `${baseUrl}/api/coupon/apply`, // Replace with your backend endpoint
//         { code: couponCode, cartTotal }
//         // { headers: token } // Replace with your token retrieval logic
//       );

//       if (res.data.success) {
//         setAppliedCoupon(res.data.coupon); // Store applied coupon details
//         setDiscountedTotal(res.data.newTotal); // Update total with discount
//         toast.success("Coupon applied successfully");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//       toast.error(error.response?.data?.message || "Failed to apply coupon");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Title */}
//       <div className="text-2xl">
//         <div className="inline-flex gap-2 items-center mb-3">
//           <p className="text-gray-500">
//             CART <span className="text-gray-700 font-medium">TOTAL</span>
//           </p>
//           <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
//         </div>
//       </div>

//       {/* Coupon Section */}
//       <div className="mb-6">
//         <p className="text-lg font-semibold mb-2">Apply Coupon</p>
//         <div className="flex gap-3 items-center">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//           />
//           <button
//             onClick={handleApplyCoupon}
//             disabled={isLoading}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Applying..." : "Apply"}
//           </button>
//         </div>
//         {appliedCoupon && (
//           <p className="text-green-600 mt-2">
//             Coupon Applied: {appliedCoupon.discountValue}{" "}
//             {appliedCoupon.discountType === "percentage" ? "%" : "$"} off
//           </p>
//         )}
//       </div>

//       {/* Cart Total Breakdown */}
//       <div className="flex flex-col gap-2 mt-2 text-sm">
//         <div className="flex justify-between">
//           <p>Subtotal</p>
//           <p>
//             {currency}
//             {cartTotal ? cartTotal.toFixed(2) : "0.00"}
//           </p>
//         </div>
//         <hr />
//         {appliedCoupon && (
//           <div className="flex justify-between">
//             <p>Discount</p>
//             <p>
//               -{currency}
//               {(cartTotal - discountedTotal).toFixed(2)}
//             </p>
//           </div>
//         )}
//         <div className="flex justify-between">
//           <p>Shipping Fee</p>
//           <p>
//             {currency} {delivery_fee}
//           </p>
//         </div>
//         <hr />
//         <div className="flex justify-between">
//           <b>Total</b>
//           <b>
//             {currency}
//             {(discountedTotal || 0) + delivery_fee}.00
//           </b>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartTotal;
