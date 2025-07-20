"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const UserPointPage = () => {
  const { user } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const res = await fetch("/api/user/data");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-gray-200 px-6 py-10 relative">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
        {userData ? (
          <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center transform transition duration-500 hover:scale-105 border-4 border-gradient-to-r from-orange-400 to-orange-600">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <Image
                src={userData.imageUrl}
                alt={userData.name}
                layout="fill"
                className="rounded-full object-cover border-4 border-orange-500 shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
              {userData.name}
            </h1>
            <div className="text-left space-y-6">
              <p className="text-gray-700 text-lg flex flex-col sm:flex-row items-start sm:items-center">
                <span className="font-semibold text-gray-800 w-full sm:w-20">
                  メール :
                </span>
                <span className="font-medium break-all">{userData.email}</span>
              </p>
              <div className="flex items-center  rounded-lg ">
                <span className="font-semibold text-gray-800 text-lg">
                  ポイント :
                </span>
                <span className="font-bold text-orange-500 text-3xl pl-3">
                  {userData.points}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">User data not found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserPointPage;
