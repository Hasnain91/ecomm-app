import axios from "axios";
import { baseUrl } from "../constants";

////////////////////////////////////////////////////////////
// ****************** Auth APIs ****************************
////////////////////////////////////////////////////////////
export const registerUser = async (userData) => {
  const response = await axios.post(`${baseUrl}/api/user/register`, userData);
  return response;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/user/login`, credentials);
  return response;
};

////////////////////////////////////////////////////////////
// ****************** Order APIs ****************************
////////////////////////////////////////////////////////////
export const fetchUserOrders = async (token) => {
  const response = await axios.post(
    `${baseUrl}/api/order/user-orders`,
    {},
    { headers: { token } }
  );
  return response;
};

export const placeOrderCOD = async (orderData, token) => {
  const response = await axios.post(
    `${baseUrl}/api/order/place-order-cod`,
    orderData,
    {
      headers: { token },
    }
  );
  return response;
};

export const placeOrderStripe = async (orderData, token) => {
  const response = await axios.post(
    `${baseUrl}/api/order/place-order-stripe`,
    orderData,
    {
      headers: { token },
    }
  );
  return response;
};

export const verifyPayment = async (paymentData, token) => {
  const response = await axios.post(
    `${baseUrl}/api/order/verify-stripe`,
    paymentData,
    {
      headers: { token },
    }
  );
  return response.data;
};

////////////////////////////////////////////////////////////
// ****************** Newsletter API ****************************
////////////////////////////////////////////////////////////
export const subscribeToNewsletter = async (email) => {
  const response = await axios.post(`${baseUrl}/api/mail/subscribe`, { email });
  return response;
};
