import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
