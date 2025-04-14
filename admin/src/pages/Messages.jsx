import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";
import { Trash } from "lucide-react";
import {
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} from "../api/endpoints";

const Messages = ({ token }) => {
  const navigate = useNavigate();

  const [messageList, setMessageList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await getAllMessages(token);

      if (res.data.success) {
        setMessageList(res.data.messages);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in fetching messages: ", error);
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const res = await updateMessageStatus(messageId, newStatus, token);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in updating message status: ", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  // Handle opening the delete modal
  const handleDeleteClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Handle deleting a message
  const removeMessage = async () => {
    if (!selectedMessage) return;
    try {
      const res = await deleteMessage(selectedMessage._id, token);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in removing message: ", error);
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <p className="text-xl font-semibold text-gray-800">All Messages</p>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-4">
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-medium text-gray-700">
          <b>Message</b>
          <b>User</b>
          <b className="text-center">Status</b>
          <b className="text-center">Action</b>
        </div>

        {/* Messages List Items */}
        {messageList.length > 0 ? (
          messageList.map((message, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[2fr_1fr_1fr_1fr] grid-cols-1 gap-4 py-4 px-4 border rounded-md shadow-sm bg-white text-sm text-gray-700"
              data-aos="zoom-in"
            >
              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-2">
                <p>
                  <span className="font-medium">Message:</span>{" "}
                  {message.message}
                </p>
                <p>
                  <span className="font-medium">User:</span>{" "}
                  {message.userId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {message.userId?.email || "N/A"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status: </span>
                  <select
                    value={message.status}
                    onChange={(e) =>
                      handleStatusChange(message._id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm font-semibold bg-gray-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleDeleteClick(message)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              {/* Desktop View */}
              <p className="hidden md:block">{message.message}</p>
              <p className="hidden md:block">
                {message.userId?.name || "N/A"} (
                {message.userId?.email || "N/A"})
              </p>
              <div className="hidden md:flex justify-center items-center">
                <select
                  value={message.status}
                  onChange={(e) =>
                    handleStatusChange(message._id, e.target.value)
                  }
                  className="  text-black rounded px-2 py-1 text-sm md:text-md font-semibold bg-gray-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                </select>
              </div>
              <div className="hidden md:flex justify-center gap-3">
                <button
                  onClick={() => handleDeleteClick(message)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={20} className="font-bold" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg md:text-xl font-bold tracking-wider mb-4">
          Confirm Deletion
        </h2>
        <p className="text-sm md:text-base">
          Are you sure you want to delete this message?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-sm md:text-base font-medium hover:bg-gray-300 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={removeMessage}
            className="px-4 py-2 bg-red-500 text-sm md:text-base font-medium text-gray-50 hover:bg-red-600 rounded-md cursor-pointer"
          >
            Delete
          </button>
        </div>
      </DeleteModal>
    </>
  );
};

export default Messages;
