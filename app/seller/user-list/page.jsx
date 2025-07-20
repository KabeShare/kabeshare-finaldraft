"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Footer from "@/components/seller/Footer";
// import { clerkClient } from '@clerk/nextjs';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/list");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(`Failed to fetch users: ${err.message}`);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = users.find((user) => user._id === userId);
      // Delete from MongoDB
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      try {
        await clerkClient.users.deleteUser(userId);
        return Response.json({ message: "User deleted" });
      } catch (error) {
        console.log(error);
        return Response.json({ error: "Error deleting user" });
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
        // Delete from Clerk using API route
        if (userToDelete) {
          const clerkRes = await fetch("/api/clerk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clerkId: userToDelete._id }),
          });
          const clerkData = await clerkRes.json();
          if (!clerkRes.ok || clerkData.error) {
            console.error("Clerk delete error:", clerkData);
            alert(
              "Warning: User deleted from database but could not be deleted from Clerk (authentication system)."
            );
          }
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleResetPoints = async (userId) => {
    // Only allow reset if user exists in MongoDB (users state)
    const userExists = users.some((user) => user._id === userId);
    if (!userExists) {
      alert("Cannot reset points: user does not exist in the database.");
      return;
    }
    try {
      const response = await fetch("/api/user/reset-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, points: 0 } : user
          )
        );
        alert("User points reset to 0 successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error resetting points:", err);
      alert("Failed to reset points");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium text-black">登録ユーザー</h2>
        {error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : users.length > 0 ? (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-black text-sm text-left">
                <tr>
                  <th className="w-1/4 px-4 py-3 font-medium ">ユーザー</th>
                  <th className="w-2/4 px-4 py-3 font-medium ">名前</th>
                  <th className="w-2/4 px-4 py-3 font-medium ">
                    メールアドレス
                  </th>
                  <th className="w-1/4 px-4 py-3 font-medium truncate">
                    ポイント
                  </th>
                  <th className="w-1/4 px-4 py-3 font-medium ">削除</th>
                  <th className="w-1/4 px-4 py-3 font-medium ">リセット</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-gray-500/20">
                    <td className="px-4 py-3 truncate">
                      <Image
                        src={user.imageUrl || "/default-avatar.png"}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 truncate">{user.name || "N/A"}</td>
                    <td className="px-4 py-3 truncate">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 truncate">{user.points ?? "0"}</td>
                    <td className="px-4 py-3 truncate">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-2 py-1 text-black rounded-md transition flex items-center justify-center hover:scale-110"
                      >
                        <Image
                          src={assets.trash}
                          alt="Trash Icon"
                          className="h-5 w-5"
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 truncate">
                      <button
                        onClick={() => handleResetPoints(user._id)}
                        className="px-2 py-1 text-blue-500 rounded-md transition flex items-center justify-center hover:scale-110"
                      >
                        <Image
                          src={assets.reset_icon}
                          alt="Reset Icon"
                          className="h-5 w-5"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-blue-500">No users found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserListPage;
