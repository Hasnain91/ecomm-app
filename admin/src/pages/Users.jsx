import React, { useEffect, useState } from "react";
import { User2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllUsers, updateUserStatus } from "../api/endpoints";
updateUserStatus;

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from the backend
  const fetchAllUsers = async () => {
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    try {
      setIsLoading(true);
      const res = await getAllUsers(token, searchTerm);

      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetchAllUsers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [token, searchTerm]);

  const handleUserStatusChange = async (e, userId) => {
    try {
      const status = e.target.value;

      const res = await updateUserStatus(userId, status, token);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAllUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetchAllUsers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-6">Users</h3>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md outline-none focus:border-blue-500"
        />
      </div>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div>
          {users.map((user, index) => (
            <div
              className="flex flex-col sm:flex-row  gap-3 items-center justify-around border-2 border-gray-500 p-5 md:p-8 my-3 md:my-4 text-sm sm:text-base text-gray-700 place-items-center  rounded-md shadow-sm bg-white"
              data-aos="zoom-in"
              key={index}
            >
              <div className="flex justify-center items-center gap-5">
                <User2 className="size-8" />

                {/* User Details */}
                <div>
                  <p className=" font-semibold tracking-wider text-base text-gray-900">
                    {`${user.name}`}
                  </p>
                  <p>{user.email}</p>
                </div>
              </div>

              <select
                value={user.status || "Active"}
                onChange={(e) => handleUserStatusChange(e, user._id)}
                className="p-2 w-[30%] font-semibold bg-gray-100 outline-none"
              >
                <option value="Active">Active</option>
                {/* <option value="Inactive">Inactive</option> */}
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
