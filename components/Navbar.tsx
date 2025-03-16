"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const { user, logout } = useContext(AuthContext)!;
    const router = useRouter();
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/products">E-Commerce</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/orders" className="hover:text-green-400">My Orders</Link>
        <Link href="/products" className="hover:text-green-400">Products</Link>
        <Link href="/cart" className="hover:text-green-400">Cart</Link>
        {user ? (
          <>
            <span className="text-green-400">{user.data.first_name}</span>
            <button
              onClick={() => { logout(); router.push("/auth/login"); }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
}
