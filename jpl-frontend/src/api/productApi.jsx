import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
