"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)!;
  const router = useRouter();

  if (!user) return <p>Loading...</p>;
    console.log(user);
  return (
    <div className="p-4">
      <h1 className="text-2xl">Welcome <span className="text-2xl text-green-500">{user.data.first_name}</span></h1>
      <button onClick={() => { logout(); router.push("/auth/login"); }} className="mt-4 bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
}
