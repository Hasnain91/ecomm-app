import axios from "axios";
import { backendUrl } from "../constants/index.js";

/////////////////////////////////////////////////////////
// ***************** Product APIs ***********************
/////////////////////////////////////////////////////////

export const addProduct = async (formData, token) => {
  const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
    headers: { token },
  });

  return response;
};

export const getAllProducts = async (searchTerm, currentPage, token) => {
  const response = await axios.get(`${backendUrl}/api/product/list`, {
    params: { q: searchTerm, page: currentPage, limit: 10 },
    headers: { token },
  });

  return response;
};

export const deleteProduct = async (productId, token) => {
  const response = await axios.post(
    `${backendUrl}/api/product/remove`,
    { id: productId },
    { headers: { token } }
  );
  return response;
};

/////////////////////////////////////////////////////////
// ***************** Order APIs***********************
/////////////////////////////////////////////////////////
export const getAllOrders = async (searchTerm, currentPage, token) => {
  const response = await axios.post(
    `${backendUrl}/api/order/list`,
    { params: { q: searchTerm, page: currentPage, limit: 10 } },
    { headers: { token } }
  );
  return response;
};

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await axios.post(
    `${backendUrl}/api/order/status`,
    { orderId, status },
    { headers: { token } }
  );
  return response;
};

/////////////////////////////////////////////////////////
// ***************** User APIs***********************
/////////////////////////////////////////////////////////

export const getAllUsers = async (token) => {
  const response = await axios.get(`${backendUrl}/api/user/all-users`, {
    headers: { token },
  });
  return response;
};

export const updateUserStatus = async (userId, status, token) => {
  const response = await axios.post(
    `${backendUrl}/api/user/update-status`,
    { userId, status },
    { headers: { token } }
  );
  return response;
};

/////////////////////////////////////////////////////////
// ***************** Auth APIs***********************
/////////////////////////////////////////////////////////
export const adminLogin = async (credentials) => {
  const response = await axios.post(
    `${backendUrl}/api/user/admin`,
    credentials
  );
  return response;
};
