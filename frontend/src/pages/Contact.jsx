import React from "react";
import { assets } from "../constants/index";
import Newsletter from "../components/Newsletter";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-3xl pt-10 border-t">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            CONTACT <span className="text-gray-700 font-medium">US</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-10 mb-28">
        <img
          src={assets.contact_img}
          alt="Image"
          className="w-full md:max-w-[480px]"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-400">
            Shop No 10, 46/A/2, <br /> Shadman Market Lahore, 54000, Pakistan
          </p>
          <p className="text-gray-400">
            Tel: +92 300 123456 <br />
            Email: info@forever.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Forever
          </p>
          <p className="text-gray-400">
            Learn more about our teams and job openings.
          </p>

          <button className="border border-black px-8 py-4 text-lg hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            Explore Jobs
          </button>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

export default Contact;
