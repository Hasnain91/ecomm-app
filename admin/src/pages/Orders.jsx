import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../constants";
import { assets } from "../assets/assets";
import { getAllOrders, updateOrderStatus } from "../api/endpoints";
import Pagination from "../components/Pagination";
import { highlightSearchTerm } from "../utils/Helper";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await getAllOrders(searchTerm, currentPage, token);

      if (res.data.success) {
        setOrders(res.data.ordersAdmin);
        setTotalPages(res.data.totalPages);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetchAllOrders :", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchAllOrders();
  }, [searchTerm, currentPage, token]);

  const handleOrderStatusChange = async (e, orderId) => {
    try {
      const newStatus = e.target.value;
      const res = await updateOrderStatus(orderId, newStatus, token);

      if (res.data.success) {
        toast.success("Order status updated.");
        fetchAllOrders();
      } else {
        toast.error(res.data.message || "Failed to update order status.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status.");
    }
  };

  const confirmCancel = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // const cancelOrder = async () => {
  //   const order = selectedOrder;
  //   try {
  //     if (!order) return;
  //     console.log("Order that will be cancelled: ", order);

  //     if (order.paymentMethod === "Stripe" && order.paymentIntentId) {
  //       const refundRes = await axios.post(
  //         `${backendUrl}/api/order/refund`,
  //         { orderId: order._id },
  //         { headers: { token } }
  //       );

  //       if (!refundRes.data.success) {
  //         toast.error(refundRes.data.message || "Refund failed.");
  //         setShowModal(false);
  //         return;
  //       }

  //       toast.success("Refund processed.");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Cancellation failed.");
  //   } finally {
  //     setShowModal(false);
  //     setSelectedOrder(null);
  //   }
  // };
  const cancelOrder = async () => {
    const order = selectedOrder;
    try {
      if (!order) return;
      console.log("Order that will be cancelled: ", order);

      // Update the order status in the UI immediately
      const updatedOrder = { ...order, status: "Cancelled" };
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord._id === updatedOrder._id ? updatedOrder : ord
        )
      );

      if (order.paymentMethod === "Stripe" && order.paymentIntentId) {
        const refundRes = await axios.post(
          `${backendUrl}/api/order/refund`,
          { orderId: order._id },
          { headers: { token } }
        );

        if (!refundRes.data.success) {
          toast.error(refundRes.data.message || "Refund failed.");
          setShowModal(false);
          return;
        }

        toast.success("Refund processed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed.");
    } finally {
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center flex-wrap gap-2.5 md:gap-0">
          <h3>Orders Page</h3>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border shadow-sm bg-white border-gray-300 rounded-md w-96 focus:outline-none focus:shadow-2xl focus:shadow-gray-500 focus:border-gray-500 transition"
          />
        </div>

        <div>
          {[...orders].reverse().map((order, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 p-5 md:p-8 my-3 md:my-4 text-sm sm:text-base rounded-md shadow-sm bg-white ${
                order.status === "Cancelled"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-500 text-gray-700"
              }`}
            >
              <img
                className="w-12"
                src={assets.parcel_icon}
                alt="Parcel Icon"
              />

              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p className="py-1" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 mb-2 font-semibold tracking-wider text-base">
                  {highlightSearchTerm(
                    `${order.address.firstName} ${order.address.lastName}`,
                    searchTerm
                  )}
                </p>
                <div>
                  <p>{`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                </div>
                <p>{highlightSearchTerm(order.address.phone, searchTerm)}</p>
              </div>

              <div>
                <p className="text-base sm:text-[18px]">
                  Items: {order.items.length}
                </p>
                <p className="mt-3">Payment Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <p className="text-base sm:text-[18px]">
                {currency}
                {order.amount}
              </p>

              <div className="flex flex-col gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleOrderStatusChange(e, order._id)}
                  className="p-2 font-semibold bg-gray-100 outline-none"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Order Dispatched">Order Dispatched</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {!["Cancelled", "Delivered"].includes(order.status) && (
                  <button
                    onClick={() => confirmCancel(order)}
                    className="bg-red-500 text-white text-sm py-2 rounded hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-white/20 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                No, Keep Order
              </button>
              <button
                onClick={cancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
