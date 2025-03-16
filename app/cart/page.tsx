"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getCartItems, updateCartItem , deleteCartItem, createOrder} from "@/lib/api";
import toast ,{ Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    status: string;
    quantity: number;
  };
  quantity: number;
}

export default function CartPage() {
  const { user } = useContext(AuthContext)!;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    try {
      const data = await getCartItems(user.data.id);
      setCartItems(data);
     
    } catch (error) {
      toast.error("Failed to fetch cart items.");
    }
  };

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    try {
      await updateCartItem(cartItemId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Cart updated!");
    } catch (error) {
      toast.error("Failed to update cart item.");
    }
  };

  const handleDelete = async (cartId: number) => {
    try {
      await deleteCartItem(cartId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item.");
    }
  };
  const handleBuy = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty!");
      return;
    }
  
    try {
      await Promise.all(
        cartItems.map(async (item) => {
          const payload = {
            user_id: user.data.id, 
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            description: item.product.description,
            status: "pending", 
          };
          await createOrder(payload);
        })
      );
  
      toast.success("Order placed successfully!");
      router.push("/products")

    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place the order.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">{item.product.description}</p>
                <p className="text-green-500 font-bold">${item.product.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-200 text-white rounded"
                >
                  ❌
                </button>
              
              </div>
              
            </div>
            
          ))}
           <button
          onClick={handleBuy}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-lg"
        >
          BUY NOW
        </button>
            <Toaster />
        </div>
      )}
    </div>
  );
}
