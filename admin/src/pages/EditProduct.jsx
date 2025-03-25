import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../constants";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { updateProduct } from "../api/endpoints";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backendUrl}/api/product/single/${id}`);
        if (res.data.success) {
          setProductData(res.data.product);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch product"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const res = await updateProduct(id, formData, token);

      //
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/list-products");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error updating product:", error);
      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!productData) return <p>Loading...</p>;

  return (
    <ProductForm
      initialData={productData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default EditProduct;
