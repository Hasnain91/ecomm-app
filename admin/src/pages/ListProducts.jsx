import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../constants";
import DeleteModal from "../components/DeleteModal";
import {
  Delete,
  DeleteIcon,
  Trash,
  Trash2,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";

const ListProducts = ({ token }) => {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const removeProduct = async () => {
    if (!selectedProduct) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: selectedProduct._id },
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
    setIsModalOpen(false);
    setSelectedProduct(null);
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
              onClick={() => handleDeleteClick(prod)}
              className=" mx-auto text-red-400  cursor-pointer text-xl font-bold "
            >
              <Trash />
            </p>
          </div>
        ))}
      </div>

      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-lg ">
          Are you sure you want to delete this product?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={removeProduct}
            className="px-4 py-2 bg-red-500 text-lg font-medium text-gray-50 hover:bg-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </>
  );
};

export default ListProducts;
