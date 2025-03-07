import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../constants";

const ListProducts = ({ token }) => {
  const [productList, setProductList] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProductList(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetching products: ", error);
      toast.error(error?.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in removing product: ", error);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <p className="mb-6 text-xl font-semibold">All Products</p>

      <div className="flex flex-col gap-2">
        {/* List table Title */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-base">
          <b>Image </b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Products List */}
        {productList.map((prod, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-base"
            key={index}
          >
            <img className="w-12" src={prod.image[0]} alt="Product Image" />
            <p>{prod.name}</p>
            <p>{prod.category}</p>
            <p>
              {currency}
              {prod.price}
            </p>
            <p
              onClick={() => removeProduct(prod._id)}
              className="text-right md:text-center cursor-pointer text-xl font-bold "
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProducts;
