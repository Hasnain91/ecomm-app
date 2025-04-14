import axios from "axios";
import { backendUrl } from "../constants/index.js";

/////////////////////////////////////////////////////////
// ***************** Product APIs ***********************
/////////////////////////////////////////////////////////

export const addProduct = async (formData, token) => {
  const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
    headers: { token },
  });
  console.log(response);

  return response;
};

export const getAllProducts = async (searchTerm, currentPage, token) => {
  const response = await axios.get(`${backendUrl}/api/product/list`, {
    params: { q: searchTerm, page: currentPage, limit: 30 },
    headers: { token },
  });

  return response;
};

export const updateProduct = async (id, formData, token) => {
  const response = await axios.put(
    `${backendUrl}/api/product/edit/${id}`,
    formData,
    {
      headers: { token },
    }
  );
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

/////////////////////////////////////////////////////////
// ***************** Coupon APIs***********************
/////////////////////////////////////////////////////////

// Add a coupon
export const addCoupon = async (couponData, token) => {
  try {
    const res = await axios.post(`${backendUrl}/api/coupon/add`, couponData, {
      headers: { token },
    });
    return res;
  } catch (error) {
    console.error("Error adding coupon:", error);
    throw error;
  }
};

// Fetch all coupons (with pagination)
export const getAllCoupons = async (token) => {
  try {
    const res = await axios.get(`${backendUrl}/api/coupon/all`, {
      headers: { token },
    });
    return res;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Update an existing coupon
export const updateCoupon = async (couponId, updatedData, token) => {
  try {
    const res = await axios.put(
      `${backendUrl}/api/coupon/update/${couponId}`,
      updatedData,
      { headers: { token } }
    );
    return res;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

// Delete a coupon
export const deleteCoupon = async (couponId, token) => {
  try {
    const res = await axios.delete(
      `${backendUrl}/api/coupon/delete/${couponId}`,
      {
        headers: { token },
      }
    );
    return res;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// Get a single coupon
export const getCoupon = async (id, token) => {
  try {
    const res = await axios.get(`${backendUrl}/api/coupon/${id}`, {
      headers: { token },
    });
    return res;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};
// export const applyCoupon = async (code, cartTotal) => {
//   try {
//     const res = await axios.get(
//       `${backendUrl}/api/coupon/apply`,
//       code,
//       cartTotal
//     );
//     return res;
//   } catch (error) {
//     console.error("Error deleting coupon:", error);
//     throw error;
//   }
// };

/////////////////////////////////////////////////////////
// ***************** Coupon APIs***********************
/////////////////////////////////////////////////////////

// Get All Messages
export const getAllMessages = async (token) => {
  const response = axios.get(`${backendUrl}/api/messages/`, {
    headers: { token },
  });

  return response;
};
// Update Message Status
export const updateMessageStatus = async (id, status, token) => {
  const response = axios.put(
    `${backendUrl}/api/messages/${id}`,
    { status },
    {
      headers: { token },
    }
  );

  return response;
};
// Update Message Status
export const deleteMessage = async (id, token) => {
  const response = axios.delete(`${backendUrl}/api/messages/${id}`, {
    headers: { token },
  });

  return response;
};
