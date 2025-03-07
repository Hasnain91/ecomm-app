import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
// import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        {/* <Title heading={"LATEST"} description={"COLLECTION"} /> */}
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            LATEST <span className="text-gray-700 font-medium">COLLECTION</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover the newest trends and elevate your style with our handpicked
          selection.
        </p>
      </div>

      {/* Display Products with product item comp */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {latestProducts?.map((product, index) => (
          <ProductItem
            key={index}
            name={product?.name}
            id={product?._id}
            image={product?.image}
            price={product?.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
