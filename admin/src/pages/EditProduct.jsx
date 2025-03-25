import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../constants";
import { LoaderCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = ({ token }) => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backendUrl}/api/product/single/${id}`);
        if (res.data.success) {
          const product = res.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setCategory(product.category);
          setSubcategory(product.subCategory);
          setBestseller(product.bestSeller);
          setSizes(product.sizes || []);
          // Set existing images
          setImage1(product.image[0] || null);
          setImage2(product.image[1] || null);
          setImage3(product.image[2] || null);
          setImage4(product.image[3] || null);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch product"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestSeller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const res = await axios.put(
        `${backendUrl}/api/product/edit/${id}`,
        formData,
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/list-products"); // Redirect to product list after successful update
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error updating product:", error);
      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full items-start gap-3"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-1">
            <label htmlFor="image1">
              <img
                className="w-20"
                // src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
                src={
                  image1
                    ? typeof image1 === "string"
                      ? image1 // Display existing image URL
                      : URL.createObjectURL(image1) // Display newly uploaded image
                    : assets.upload_area
                }
                alt="Product Image"
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2">
              <img
                className="w-20" // src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
                src={
                  image2
                    ? typeof image2 === "string"
                      ? image2
                      : URL.createObjectURL(image2)
                    : assets.upload_area
                }
                alt="Product Image"
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3">
              <img
                className="w-20"
                src={
                  image3
                    ? typeof image3 === "string"
                      ? image3
                      : URL.createObjectURL(image3)
                    : assets.upload_area
                }
                alt="Product Image"
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4">
              <img
                className="w-20"
                src={
                  image4
                    ? typeof image4 === "string"
                      ? image4
                      : URL.createObjectURL(image4)
                    : assets.upload_area
                }
                alt="Product Image"
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>

        {/* Product Name */}
        <div className="w-full mt-4">
          <p className="mb-2">Product Name</p>
          <input
            className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Type Here..."
            required
          />
        </div>

        {/* Product Description */}
        <div className="w-full mt-4">
          <p className="mb-2">Product Description</p>
          <textarea
            cols="20"
            rows="5"
            className="w-full max-w-[500px] bg-gray-50 px-3 py-2 border border-gray-300 outline-none rounded-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write content here..."
            required
          ></textarea>
        </div>

        {/* Category and Subcategory */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-3">Product Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 outline-none"
            >
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <div>
            <p className="mb-3">Sub Category</p>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 outline-none"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className="mb-3">Product Price</p>
            <input
              type="number"
              value={price}
              placeholder="e.g. 20"
              className="w-full px-3 py-1.5 sm:w-[120px] bg-gray-50 outline-none"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-3">Product Sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes(size)
                      ? "bg-pink-200 border-pink-600"
                      : "bg-slate-300"
                  } px-3 py-1 cursor-pointer`}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Seller Checkbox */}
        <div className="flex gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to BestSeller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer flex justify-center items-center gap-2 w-45 py-3 mt-4 font-medium text-base bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Updating Product" : "UPDATE PRODUCT"}
          <LoaderCircle
            className={`${
              isLoading ? "size-4 inline-flex animate-spin" : "hidden"
            }`}
          />
        </button>
      </form>
    </>
  );
};

export default EditProduct;
