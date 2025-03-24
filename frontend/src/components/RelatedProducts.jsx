import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, type }) => {
  const products = useSelector((state) => state.products.list);

  const [relatedProd, setRelatedProd] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => type === item.subCategory);

      setRelatedProd(productsCopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-20">
      <div className="text-center py-2 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            RELATED <span className="text-gray-700 font-medium">PRODUCTS</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {relatedProd?.map((product, index) => (
          <ProductItem
            key={index}
            id={product?._id}
            image={product?.image}
            name={product?.name}
            price={product?.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
