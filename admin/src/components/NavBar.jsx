import { assets } from "../assets/assets";
const NavBar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between py-4 px-[5%]">
      <img className="w-[max(15%)]" src={assets.logo} alt="" />
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 rounded-full text-sm sm:text-base font-medium cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
