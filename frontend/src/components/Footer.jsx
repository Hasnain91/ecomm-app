import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mt-40 my-10 text-sm">
        <div>
          <img src={assets.logo} alt="Logo" className="mb-5 w-32" />
          <p className="w-full md:w-3/4 text-gray-600">
            At FOREVER , we are committed to providing you with the best
            shopping experience. From handpicked products to seamless delivery,
            we ensure quality and satisfaction at every step. Our dedicated
            customer support team is always here to assist you, ensuring peace
            of mind with every purchase. We believe in building lasting
            relationships by delivering value, trust, and exceptional service.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+92 300 1234567</li>
            <li>info@forever.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="text-sm text-center py-5">
          Copyright 2025 &copy; FOREVER - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
