"use client";
import axios from "axios";

const BASE_URL = "http://localhost:8000"; 
const BASE_URL_2 = "http://localhost:8001"; 
export const signupUser = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${BASE_URL}/auth/signup`, userData);
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  return axios.post(`${BASE_URL}/auth/login`, userData);
};

export const getUserDetails = async (token: string) => {
  return axios.get(`${BASE_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProducts = async () => {
  const response = await axios.get(`${BASE_URL_2}/products/`);
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await axios.get(`${BASE_URL_2}/products/${id}/`);
  return response.data;
};


export const addToCart = async (payload: { user_id: number; product_id: number; quantity: number }) => {
  try {
    const response = await axios.post(`${BASE_URL_2}/cart/add/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const getCartItems = async (userId: number) => {
  try {
    const response = await axios.get(`${BASE_URL_2}/cart/user/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
  try {
    const response = await axios.put(`${BASE_URL_2}/cart/update/${cartItemId}/`, { quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};


export const deleteCartItem = async (cartId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL_2}/cart/delete/${cartId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart items:", error);
    throw error;
  }
};


export const createOrder = async (orderData: {
  user_id: number;
  product_name: string;
  quantity: number;
  price: number;
  description: string;
  status: string;
}) => {
  const response = await axios.post(`${BASE_URL_2}/orders/create/`, orderData);

  return response.data;
};

export async function getOrders() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL_2}/orders/list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}