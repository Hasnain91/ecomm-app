import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { assets } from "../constants/index";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { backendUrl } from "../../../admin/src/constants";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false); // Declare showFilter state
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const search = useSelector((state) => state.search.search);
  const showSearch = useSelector((state) => state.search.showSearch);

  // Fetch products based on filters
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (showSearch && search) queryParams.append("q", search);
      if (categoryFilter.length > 0)
        queryParams.append("category", categoryFilter.join(","));
      if (typeFilter.length > 0)
        queryParams.append("subcategory", typeFilter.join(","));
      if (sortType !== "relevant") queryParams.append("sort", sortType);

      // Make API call
      const res = await axios.get(
        `${backendUrl}/api/product/list?${queryParams.toString()}`
      );
      console.log("Query Params:", queryParams.toString());
      if (res.data.success) {
        setProducts(res.data.allProducts); // Use allProducts for frontend
      } else {
        console.error("Error fetching products:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, showSearch, categoryFilter, typeFilter, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Search Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)} // Toggle filter visibility
          className="text-xl my-2 flex items-center gap-2 cursor-pointer"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} // Rotate icon when expanded
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Categories */}
        <div
          className={`border border-gray-400 pl-5 py-3 mt-6 ${
            showFilter ? "block" : "hidden" // Show/hide based on showFilter
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-800">
            {["Men", "Women", "Kids"].map((category) => (
              <p key={category} className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={category}
                  checked={categoryFilter.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategoryFilter((prev) => [...prev, category]);
                    } else {
                      setCategoryFilter((prev) =>
                        prev.filter((item) => item !== category)
                      );
                    }
                  }}
                />
                {category}
              </p>
            ))}
          </div>
        </div>

        {/* Types */}
        <div
          className={`border border-gray-400 pl-5 py-3 my-5 ${
            showFilter ? "block" : "hidden" // Show/hide based on showFilter
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-800">
            {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
              <p key={type} className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={type}
                  checked={typeFilter.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTypeFilter((prev) => [...prev, type]);
                    } else {
                      setTypeFilter((prev) =>
                        prev.filter((item) => item !== type)
                      );
                    }
                  }}
                />
                {type}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Product Collection */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500">
              ALL <span className="text-gray-700 font-medium">COLLECTIONS</span>
            </p>
            <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
          </div>
          {/* Sorting Dropdown */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-400 text-sm p-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-to-high">Sort by: Low to High</option>
            <option value="high-to-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Show all products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductItem
                key={index}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
