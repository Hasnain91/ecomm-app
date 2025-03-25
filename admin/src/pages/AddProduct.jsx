import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../constants";
import ProductForm from "../components/ProductForm";
import { addProduct } from "../api/endpoints";

const AddProduct = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const res = await addProduct(formData, token);

      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in adding product: ", error);
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default AddProduct;
