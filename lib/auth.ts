"use server";

import { cookies } from "next/headers";

export const getUserDetails = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const response = await fetch("http://localhost:8000/protected", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json();
};
