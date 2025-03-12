import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../constants";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
        console.log(res.data.orders);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetchAllOrders :", error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleOrderStatus = async (e, orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        { headers: { token } }
      );

      if (res.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log("Error in handleOrderStatus :", error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Orders Page</h3>
      <div>
        {orders
          .slice()
          .reverse()
          .map((order, index) => (
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
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <p className="py-1" key={index}>
                          {item.name} x {item.quantity} <span>{item.size}</span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="py-1" key={index}>
                          {item.name} x {item.quantity} <span>{item.size}</span>
                          ,
                        </p>
                      );
                    }
                  })}
                </div>
                <p className="mt-3 mb-2 font-semibold tracking-wider text-base text-gray-900">{`${order.address.firstName} ${order.address.lastName}`}</p>
                <div>
                  <p>{`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                </div>
                <p>{order.address.phone}</p>
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
  );
};

export default Orders;
