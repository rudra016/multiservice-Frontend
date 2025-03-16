"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  status: string;
  quantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-500 font-bold">${product.price}</p>
              <Link href={`/products/${product.id}`} className="text-blue-500 mt-2 inline-block">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}
