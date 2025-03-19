import { NavLink } from "react-router-dom";
import { Users } from "lucide-react";
import { assets } from "../assets/assets";
const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          to="/list-products"
          className={({ isActive }) =>
            `flex items-center gap-3  border-r-0 px-3 py-2 rounded-lg ${
              isActive
                ? "border border-pink-700 bg-pink-200"
                : "border border-gray-300"
            }`
          }
        >
          <img className="size-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3  border-r-0 px-3 py-2 rounded-lg ${
              isActive
                ? "border border-pink-700 bg-pink-200"
                : "border border-gray-300"
            }`
          }
        >
          <img className="size-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-3  border-r-0 px-3 py-2 rounded-lg ${
              isActive
                ? "border border-pink-700 bg-pink-200"
                : " border border-gray-300"
            }`
          }
        >
          <Users className="size-5" />
          <p className="hidden md:block">Users</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
