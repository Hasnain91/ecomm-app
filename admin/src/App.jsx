import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import AddProduct from "./pages/AddProduct";
import ListProducts from "./pages/ListProducts";
import Orders from "./pages/orders";
import { useEffect } from "react";
import Users from "./pages/Users";
import EditProduct from "./pages/EditProduct";

const App = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const loadToken = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";
  const [token, setToken] = useState(loadToken);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-200 min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "20px",
            borderRadius: "100px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
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
                <Route path="/users" element={<Users token={token} />} />
                <Route
                  path="/edit-product/:id"
                  element={<EditProduct token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
