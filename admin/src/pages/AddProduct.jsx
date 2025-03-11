import { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../constants";
import { LoaderCircle } from "lucide-react";

const AddProduct = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("bestSeller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const res = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in adding product: ", error);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-1">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
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
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
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
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
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
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
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

      <div className="w-full mt-4">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 bg-gray-50 border border-gray-300 outline-none rounded-sm"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Type Here..."
          required
        />
      </div>

      <div className="w-full mt-4">
        <p className="mb-2">Product description</p>
        <textarea
          cols="20"
          rows="5"
          className="w-full max-w-[500px] bg-gray-50 px-3 py-2 border border-gray-300 outline-none rounded-sm"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          placeholder="Write content here..."
          required
        ></textarea>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-3">Product Category</p>
          <select
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
            type="Number"
            value={price}
            placeholder="e.g. 20"
            className="w-full px-3 py-1.5 sm:w-[120px] bg-gray-50 outline-none"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="mb-3">Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item !== "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("S")
                  ? "bg-pink-200  border-pink-600"
                  : "bg-slate-300 "
              }bg-slate-300 px-3 py-1 cursor-pointer`}
            >
              S
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item !== "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("M")
                  ? "bg-pink-200  border-pink-600"
                  : "bg-slate-300 "
              }bg-slate-300 px-3 py-1 cursor-pointer`}
            >
              M
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item !== "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("L")
                  ? "bg-pink-200  border-pink-600"
                  : "bg-slate-300 "
              }bg-slate-300 px-3 py-1 cursor-pointer`}
            >
              L
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item !== "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XL")
                  ? "bg-pink-200  border-pink-600"
                  : "bg-slate-300 "
              }bg-slate-300 px-3 py-1 cursor-pointer`}
            >
              XL
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item !== "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XXL")
                  ? "bg-pink-200  border-pink-600"
                  : "bg-slate-300 "
              }bg-slate-300 px-3 py-1 cursor-pointer`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

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

      <button
        type="submit"
        disabled={isLoading}
        className={`cursor-pointer flex justify-center items-center gap-2 w-45 py-3 mt-4 font-medium text-base bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {isLoading ? "Adding Product" : "ADD PRODUCT"}
        <LoaderCircle
          className={`${
            isLoading ? "size-4 inline-flex animate-spin" : "hidden"
          }`}
        />
      </button>
    </form>
  );
};

export default AddProduct;
