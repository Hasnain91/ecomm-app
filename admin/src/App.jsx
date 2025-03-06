import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import AddProduct from "./pages/AddProduct";
import ListProducts from "./pages/AddProduct";
import Orders from "./pages/AddProduct";
import { backendUrl } from "./constants/index";
import { useEffect } from "react";

const App = () => {
  const loadToken = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";
  const [token, setToken] = useState(loadToken);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <NavBar setToken={setToken} />
          <hr />
          <div className="flex w-full ">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route
                  path="/add-product"
                  element={<AddProduct token={token} />}
                />
                <Route
                  path="/list-products"
                  element={<ListProducts token={token} />}
                />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
