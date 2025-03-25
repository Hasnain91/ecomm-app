import { useState } from "react";
import { assets } from "../assets/assets";
import { LoaderCircle } from "lucide-react";

const ProductForm = ({
  initialData = {}, // For EditProduct, pass existing product data
  onSubmit,
  isLoading,
}) => {
  const [image1, setImage1] = useState(initialData.image?.[0] || null);
  const [image2, setImage2] = useState(initialData.image?.[1] || null);
  const [image3, setImage3] = useState(initialData.image?.[2] || null);
  const [image4, setImage4] = useState(initialData.image?.[3] || null);
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price?.toString() || "");
  const [category, setCategory] = useState(initialData.category || "Men");
  const [subcategory, setSubcategory] = useState(
    initialData.subCategory || "Topwear"
  );
  const [bestseller, setBestseller] = useState(!!initialData.bestSeller);
  const [sizes, setSizes] = useState(initialData.sizes || []);

  const handleSubmit = (e) => {
    e.preventDefault();
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

    onSubmit(formData); // Pass the form data to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((num) => {
            const image = eval(`image${num}`);
            const setImage = eval(`setImage${num}`);
            return (
              <label key={num} htmlFor={`image${num}`}>
                <img
                  className="w-20"
                  src={
                    image
                      ? typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                      : assets.upload_area
                  }
                  alt={`Product Image ${num}`}
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id={`image${num}`}
                  hidden
                />
              </label>
            );
          })}
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

      {/* Category, Subcategory, and Price */}
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
        {isLoading ? "Processing..." : "SUBMIT"}
        <LoaderCircle
          className={`${
            isLoading ? "size-4 inline-flex animate-spin" : "hidden"
          }`}
        />
      </button>
    </form>
  );
};

export default ProductForm;
