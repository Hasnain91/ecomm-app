import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const { products } = useContext(ShopContext);

  useEffect(() => {
    setAllProducts(products);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t ">
      {/* Search Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-xl my-2 flex items-center gap-2 cursor-pointer"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Categories */}
        <div
          className={`border border-gray-400 pl-5 py-3 mt-6 ${
            showFilter ? " " : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-800">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Men`} /> Men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Women`} /> Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Kids`} /> Kids
            </p>
          </div>
        </div>

        {/* Types */}
        <div
          className={`border border-gray-400 pl-5 py-3 my-5 ${
            showFilter ? " " : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-800">
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Topwear`} />
              Topwear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Bottomwear`} />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input type="checkbox" className="w-3" value={`Winterwear`} />
              Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Product Collection */}
      <div className="flex-1 ">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500">
              ALL <span className="text-gray-700 font-medium">COLLECTIONS</span>
            </p>
            <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
          </div>
          {/* Product Sorting */}
          <select className="border-2 border-gray-400 text-sm p-2  ">
            <option value="relevant">Sort by: relevant</option>
            <option value="low-to-high">Sort by: Low to high</option>
            <option value="high-to-low">Sort by: High to low</option>
          </select>
        </div>

        {/* Show all products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {allProducts.map((product, index) => (
            <ProductItem
              key={index}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
