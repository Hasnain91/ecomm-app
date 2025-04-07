// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import DeleteModal from "../components/DeleteModal";
// import { Trash, Pencil } from "lucide-react";
// import Pagination from "../components/Pagination";
// import { getAllProducts, deleteProduct } from "../api/endpoints";
// import { highlightSearchTerm } from "../utils/Helper";

// const ListProducts = ({ token }) => {
//   const navigate = useNavigate();

//   const [productList, setProductList] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   // For pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const res = await getAllProducts(searchTerm, currentPage, token);

//       if (res.data.success) {
//         setProductList(res.data.productsAdmin);
//         setTotalPages(res.data.totalPages);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.log("Error in fetching products: ", error);
//       toast.error(error?.response?.data?.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//     fetchProducts();
//   }, [searchTerm]);

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage]);

//   const handleDeleteClick = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const removeProduct = async () => {
//     if (!selectedProduct) return;
//     try {
//       const res = await deleteProduct(selectedProduct._id, token);

//       if (res.data.success) {
//         toast.success(res.data.message);
//         await fetchProducts();
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.log("Error in removing product: ", error);
//       toast.error(error?.message);
//     }
//     setIsModalOpen(false);
//     setSelectedProduct(null);
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <p className="text-xl font-semibold">All Products</p>
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)} // Update search term
//           className="px-4 py-2 border bg-gray-50 border-gray-300 rounded-md w-96 focus:outline-none focus:shadow-2xl focus:shadow-gray-500 focus:border-gray-500 transition"
//         />

//         <button
//           onClick={() => navigate("/add-product")}
//           className="
//           bg-gray-900 text-gray-100 px-3 py-2 cursor-pointer rounded hover:opacity-70"
//         >
//           Add Product
//         </button>
//       </div>

//       <div className="flex flex-col gap-2">
//         {/* List table Title */}
//         <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-base">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b className="text-center">Action</b>
//         </div>

//         {/* Products List */}
//         {productList.length > 0 ? (
//           productList.map((prod, index) => (
//             <div
//               className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-base"
//               key={index}
//             >
//               <img className="w-12" src={prod.image[0]} alt="Product Image" />
//               <p>{highlightSearchTerm(prod.name, searchTerm)}</p>
//               <p>{highlightSearchTerm(prod.category, searchTerm)}</p>
//               <p>{prod.price}</p>
//               <div className="flex justify-center gap-5 w-full place-self-center">
//                 <p
//                   onClick={() => navigate(`/edit-product/${prod._id}`)}
//                   className=" text-green-400 cursor-pointer text-xl font-bold"
//                 >
//                   <Pencil />
//                 </p>
//                 <p
//                   onClick={() => handleDeleteClick(prod)}
//                   className=" text-red-400 cursor-pointer text-xl font-bold"
//                 >
//                   <Trash />
//                 </p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No products found.</p>
//         )}
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />

//       <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h2 className="text-xl font-bold tracking-wider mb-4">
//           Confirm Deletion
//         </h2>
//         <p className="text-lg">Are you sure you want to delete this product?</p>
//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md mr-2 cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={removeProduct}
//             className="px-4 py-2 bg-red-500 text-lg font-medium text-gray-50 hover:bg-red-600 rounded-md cursor-pointer"
//           >
//             Delete
//           </button>
//         </div>
//       </DeleteModal>
//     </>
//   );
// };

// export default ListProducts;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";
import { Trash, Pencil } from "lucide-react";
import Pagination from "../components/Pagination";
import { getAllProducts, deleteProduct } from "../api/endpoints";
import { highlightSearchTerm } from "../utils/Helper";

const ListProducts = ({ token }) => {
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getAllProducts(searchTerm, currentPage, token);

      if (res.data.success) {
        setProductList(res.data.productsAdmin);
        setTotalPages(res.data.totalPages);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetching products: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const removeProduct = async () => {
    if (!selectedProduct) return;
    try {
      const res = await deleteProduct(selectedProduct._id, token);

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

  return (
    <>
      <div className="flex justify-between items-center flex-wrap  mb-6  gap-4">
        {/* Title */}
        <p className="text-xl font-semibold">All Products</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border bg-gray-50 border-gray-300 rounded-md w-full md:w-96 focus:outline-none focus:shadow-2xl focus:shadow-gray-500 focus:border-gray-500 transition"
        />

        {/* Add Product Button */}
        <button
          onClick={() => navigate("/add-product")}
          className="bg-gray-900 text-gray-100 px-3 py-2  cursor-pointer rounded hover:opacity-70 w-full md:w-auto"
        >
          Add Product
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Table Headers */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center  gap-1 py-2 px-4 border bg-gray-100 text-base">
          <b>Image</b>
          <b>Name</b>
          <b className="text-center">Category</b>
          <b className="text-center">Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Products List */}
        {productList.length > 0 ? (
          productList.map((prod, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-4 border text-sm md:text-base"
            >
              {/* Image */}
              <img
                className="w-12 h-12 object-cover mx-auto md:mx-0"
                src={prod.image[0]}
                alt="Product Image"
              />
              {/* Name */}
              <p>{highlightSearchTerm(prod.name, searchTerm)}</p>
              {/* Category (Hidden on Mobile) */}
              <p className="hidden md:block text-center">
                {highlightSearchTerm(prod.category, searchTerm)}
              </p>
              {/* Price */}
              <p className="text-center">{prod.price}</p>
              {/* Actions */}
              <div className="flex justify-center gap-2 w-full place-self-center">
                {/* Edit Button */}
                <p
                  onClick={() => navigate(`/edit-product/${prod._id}`)}
                  className="text-green-400 cursor-pointer text-lg font-medium"
                >
                  <Pencil className="md:hidden" /> {/* Hide icon on mobile */}
                  <span className="hidden md:inline">Edit</span>{" "}
                  {/* Show text on desktop */}
                </p>
                {/* Delete Button */}
                <p
                  onClick={() => handleDeleteClick(prod)}
                  className="text-red-400 cursor-pointer text-lg font-medium"
                >
                  <Trash className="md:hidden" /> {/* Hide icon on mobile */}
                  <span className="hidden md:inline">Delete</span>{" "}
                  {/* Show text on desktop */}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-6"
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-lg">Are you sure you want to delete this product?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-lg font-medium hover:bg-gray-300 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={removeProduct}
            className="px-4 py-2 bg-red-500 text-lg font-medium text-gray-50 hover:bg-red-600 rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </>
  );
};

export default ListProducts;
