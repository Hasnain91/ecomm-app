import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products, currency } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestseller);
    setBestSellers(bestProducts.slice(0, 7));
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            BEST <span className="text-gray-700 font-medium">SELLERS</span>
          </p>
          <p className="w-8 md:w-12 h-[1px] md:h-[2px] bg-gray-800"></p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover the products that everyone is raving about—our best sellers,
          crafted to perfection.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {bestSellers?.map((product, index) => (
          <ProductItem
            key={index}
            id={product?._id}
            name={product?.name}
            image={product?.image}
            price={product?.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
