"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext"; 
import { getProductById, addToCart } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    status: string;
    quantity: number;
  }
  

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const authContext = useContext(AuthContext); // Get logged-in user
  const user = authContext ? authContext.user : null;
  
  useEffect(() => {
    if (id) {
      const productId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      getProductById(productId).then((data) => setProduct(data));
    }
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    if (!user || !user.data.id) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    if (!product) return;

    const payload = {
      user_id: user.data.id, // Current user ID
      product_id: product.id, 
      product: product.id, // Product ID
      quantity, // Selected quantity
    };

    try {
      await addToCart(payload);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart!");
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="p-6">
      <button onClick={() => router.push("/products")} className="mb-4 text-blue-500">
        ← Back to Products
      </button>
      <div className="border rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-green-500 font-bold">${product.price}</p>
        <p className="text-gray-500">Status: {product.status}</p>
        <p className="text-gray-500">Stock: {product.quantity}</p>

        {/* Quantity Selector */}
        <div className="flex items-center mt-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-lg"
          >
            -
          </button>
          <span className="px-4 py-1 border">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-lg"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add to Cart
        </button>
        <Toaster />
      </div>
    </div>
  );
}
