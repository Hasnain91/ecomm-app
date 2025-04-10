import React from "react";
import { motion } from "framer-motion";

const Animations = () => {
  const animations = [
    "fade-up",
    "slide-right",
    "zoom-in",
    "slide-left",
    "fade-down",
    "zoom-out",
  ];

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          whileHover={{ scale: 1.25, rotate: 20 }}
          transition={{ duration: "0", ease: "easeInOut" }}
          className="h-96 w-96 bg-gray-500 p-10 rounded-md flex flex-col justify-between items-center gap-10 "
          //   data-aos={index > 2 ? "slide-left" : "slide-right"}
          //   data-aos={anim}
          data-aos="fade-down"
          data-aos-delay={index === 3 ? `${index * 100}` : 0}
        >
          <h2 className="text-gray-200">Hello, {index}</h2>
          <p className="text-gray-200">
            Here, you descriotion will appear. Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Fuga assumenda inventore beatae, sunt
            aspernatur deserunt nesciunt similique autem culpa voluptatum.
          </p>
          <button className="px-4 py-2 bg-red-500 w-fit text-center rounded-sm">
            Click Me
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default Animations;
