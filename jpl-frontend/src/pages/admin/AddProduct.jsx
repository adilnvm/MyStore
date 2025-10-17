import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/admin/products/add", form);
      alert("✅ Product added successfully!");
      navigate("/admin/");
    } catch (error) {
      alert("❌ Failed to add product");
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;