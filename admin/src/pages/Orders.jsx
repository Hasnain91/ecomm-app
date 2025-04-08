import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { currency } from "../constants";
import { assets } from "../assets/assets";
import { getAllOrders, updateOrderStatus } from "../api/endpoints";
import Pagination from "../components/Pagination";
import { highlightSearchTerm } from "../utils/Helper";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      setIsLoading(true);
      const res = await getAllOrders(searchTerm, currentPage, token);

      if (res.data.success) {
        setOrders(res.data.ordersAdmin);
        // console.log("All orders are: ", res.data.allOrders);
        setTotalPages(res.data.totalPages);
        // console.log("Total Pages: ", res.data.totalPages);
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

  // useEffect(() => {
  //   fetchAllOrders();
  // }, [currentPage, token]);

  const handleOrderStatus = async (e, orderId) => {
    try {
      const newStatus = e.target.value;
      const res = await updateOrderStatus(orderId, newStatus, token);
      if (res.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log("Error in handleOrderStatus :", error);
      toast.error(
        error.response?.data?.message || "Failed to uodate order status"
      );
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
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="px-4 py-2 border bg-gray-50 border-gray-300 rounded-md w-96 focus:outline-none focus:shadow-2xl focus:shadow-gray-500 focus:border-gray-500 transition"
          />
        </div>

        <div>
          {[...orders].reverse().map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-500 p-5 md:p-8 my-3 md:my-4 text-sm sm:text-base text-gray-700"
              key={index}
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
                <p className="mt-3 mb-2 font-semibold tracking-wider text-base text-gray-900">
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
              <select
                value={order.status}
                onChange={(e) => handleOrderStatus(e, order._id)}
                className="p-2 font-semibold bg-gray-100 outline-none"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Order Dispatched">Order Dispatched</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Orders;
