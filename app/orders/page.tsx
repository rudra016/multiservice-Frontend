"use client";
import {io} from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";
import { useContext, useEffect, useRef, useState } from "react";
import { getOrders } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
interface Order {
  id: number;
  user_id: number;
  price: number;
  quantity: number;
  description: string;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext); // Get logged-in user
  const user = authContext ? authContext.user : null;
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => { 
    async function fetchOrders() {
      try {
        const data = await getOrders();
        if (user) {
             const filteredOrders = data.filter((order: Order) => order.user_id === user.data.id);
            setOrders(filteredOrders);
          }
          
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }
     if (user) fetchOrders();
  }, [user]);

  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-gray-600">{order.description}</p>
              <p className="text-green-500 font-bold">${order.price}</p>
              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-500">Status: <span className="font-semibold capitalize">{order.status}</span></p>
              <p className="text-sm text-gray-400">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          <Toaster />
        </div>
      )}
    </div>
  );
}
