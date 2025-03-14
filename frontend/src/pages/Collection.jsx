import React, { useContext, useEffect, useState } from "react";
import { CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../constants/index";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const { products, search, showSearch } = useContext(ShopContext);

  const toggleCategoryFilter = (e) => {
    if (categoryFilter.includes(e.target.value)) {
      setCategoryFilter((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setCategoryFilter((prev) => [...prev, e.target.value]);
    }
  };

  const toggleTypeFilter = (e) => {
    if (typeFilter.includes(e.target.value)) {
      setTypeFilter((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setTypeFilter((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        categoryFilter.includes(item.category)
      );
    }

    if (typeFilter.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        typeFilter.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1);
  };

  const sortPoducts = () => {
    let filterProductsCopy = filterProducts.slice();

    switch (sortType) {
      case "low-to-high":
        setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-to-low":
        setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [categoryFilter, typeFilter, search, showSearch, products]);

  useEffect(() => {
    sortPoducts();
  }, [sortType]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filterProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
              <input
                type="checkbox"
                className="w-3"
                value={`Men`}
                onChange={toggleCategoryFilter}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={`Women`}
                onChange={toggleCategoryFilter}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={`Kids`}
                onChange={toggleCategoryFilter}
              />
              Kids
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
              <input
                type="checkbox"
                className="w-3"
                value={`Topwear`}
                onChange={toggleTypeFilter}
              />
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={`Bottomwear`}
                onChange={toggleTypeFilter}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={`Winterwear`}
                onChange={toggleTypeFilter}
              />
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
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-400 text-sm p-2  "
          >
            <option value="relevant">Sort by: relevant</option>
            <option value="low-to-high">Sort by: Low to high</option>
            <option value="high-to-low">Sort by: High to low</option>
          </select>
        </div>

        {/* Show all products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {currentProducts?.map((product, index) => (
            <ProductItem
              key={index}
              id={product?._id}
              image={product?.image}
              name={product?.name}
              price={product?.price}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CircleChevronLeft size={25} />
          </button>
          <span className="px-4 py-2 bg-gray-200 font-bold text-gray-700 rounded-full">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastProduct >= filterProducts.length}
            className=" disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CircleChevronRight size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collection;
