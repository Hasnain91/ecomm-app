import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((product) => {
      if (product._id === productId) {
        setProductData(product);
        setImage(product.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[19%]">
            {productData.image.map((image, index) => (
              <img
                onClick={() => setImage(image)}
                src={image}
                key={index}
                alt="Product Image"
                className="w-[25%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="Product Image" className="w-full h-auto" />
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 ">
          <h1 className="text-2xl font-medium mt-4">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-4">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-6 text-2xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-6 md:w-4/5 text-gray-600">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-10">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-200 font-medium ${
                    item === size ? "border-orange-400" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-black text-white px-8 py-3 cursor-pointer transition-colors duration-200 ease-in hover:text-black hover:bg-gray-100">
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div
            className=" flex flex-col gap-1 text-sm mt-8 text-gray-500
          "
          >
            <p>100% orignal product</p>
            <p>Cash on delivery available.</p>
            <p>Easy exchange and return policy</p>
          </div>
        </div>
      </div>

      {/* Description and Reveiws */}
      <div className="mt-20 ">
        <div className="flex">
          <p className="px-5 py-3 border text-sm font-semibold">Description</p>
          <p className="px-5 py-3 border text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border p-6 text-md md:text-lg text-gray-500">
          <p>
            Crafted from 100% pure cotton, this round neck t-shirt offers
            unmatched comfort and breathability. Its soft fabric ensures a
            relaxed fit, making it perfect for everyday wear. Pair it
            effortlessly with jeans or shorts for a casual yet stylish look.
            Whether you're heading out for a casual day or relaxing at home,
            this t-shirt is your go-to choice for effortless style and unmatched
            comfort.
          </p>
          <p>
            Designed for durability, this t-shirt retains its shape and color
            wash after wash. The reinforced stitching adds strength, while the
            variety of colors lets you express your style. A timeless essential
            for every man's wardrobe. The premium-quality cotton fabric is
            pre-shrunk and durable, retaining its shape and color even after
            multiple washes.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        type={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
