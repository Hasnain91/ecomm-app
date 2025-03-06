import React from "react";
import { assets } from "../constants/index";

const Policy = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400">
          Hassle-free exchanges, because your satisfaction matters.
        </p>
      </div>
      <div>
        <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">7 Days Return</p>
        <p className="text-gray-400">
          Not satisfied? Return within 7 days, no questions asked.
        </p>
      </div>
      <div>
        <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-400">
          We're here for you—always ready to help, anytime.
        </p>
      </div>
    </div>
  );
};

export default Policy;
