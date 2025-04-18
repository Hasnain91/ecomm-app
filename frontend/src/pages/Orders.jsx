import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchUserOrders } from "../api/endpoints";

const Orders = () => {
  const currency = useSelector((state) => state.config.currency);
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      if (!token) {
        return null;
      }

      const res = await fetchUserOrders(token);

      if (res.data.success) {
        let allOrders = [];
        // console.log(res.data.orders);
        // console.log(res.data.orders[0].items);
        res.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;

            allOrders.push(item);
          });
        });
        setOrders(allOrders.reverse());
      }
    } catch (error) {
      console.log("Error in fetchOrders: ", error);
      toast.error(error.message);
    }
  };
  // console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            MY <span className="text-gray-700 font-medium">ORDERS</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div>
        {orders.map((product, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            data-aos="zoom-in"
          >
            <div className="flex items-start gap-6 text-sm">
              {console.log("Current product in loop is: ", product)}
              <img
                className="w-16 sm:w-20"
                // src={product?.image[0]}
                // src={
                //   product?.image && Array.isArray(product.image)
                //     ? product.image[0]
                //     : "fallback_image_url"
                // } // Provide a fallback image URL here
                src={
                  product?.image && product.image.length > 0
                    ? product.image[0]
                    : "fallback_image_url"
                }
                alt="Product Image"
              />
              <div>
                <p className="sm:text-base font-medium">{product?.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency}
                    {product?.price}
                  </p>
                  <p>Quantity: {product?.quantity}</p>
                  <p>Size: {product?.size}</p>
                </div>
                <p className="mt-1">
                  Date:
                  <span className="text-gray-400">
                    {" "}
                    {new Date(product?.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:
                  <span className="text-gray-400">
                    {" "}
                    {product?.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-3">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base  ">{product?.status}</p>
              </div>
              <button
                onClick={fetchOrders}
                className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
