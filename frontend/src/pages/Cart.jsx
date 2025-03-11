import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../constants/index";
import CartTotal from "../components/CartTotal";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Function to handle delete confirmation
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Function to delete the item
  const confirmDelete = () => {
    if (selectedItem) {
      updateQuantity(selectedItem._id, selectedItem.size, 0);
      toast.success("Product removed from the cart.");
    }
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="border-t pt-14">
      <div className="text-3xl mb-3">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            YOUR <span className="text-gray-700 font-medium">CART</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div>
        {cartData?.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={index}
              className="p-4 border-t border-b text-gray-600 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-0"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData?.image[0]}
                  alt=""
                />

                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData?.name}
                  </p>
                  <div className="flex items-center mt-2 gap-5">
                    <p>
                      {currency}
                      {productData?.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-100">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              />
              <img
                onClick={() => handleDeleteClick(item)}
                className="w-4 sm:w-5 mr-4 cursor-pointer"
                src={assets.bin_icon}
                alt="Delete Icon"
              />
            </div>
          );
        })}
      </div>

      {/* Cart Total */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-md font-medium my-8 px-8 py-3 cursor-pointer hover:bg-gray-300 hover:text-black"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-lg">
          Are you sure you want to remove this item from the cart?
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-500 text-lg font-medium text-white hover:bg-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </div>
  );
};

export default Cart;
