import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { sendMessageToAdmin } from "../api/endpoints";

const ContactAdmin = () => {
  const [message, setMessage] = useState(""); // Message input by the user
  const [email, setEmail] = useState(""); // Message input by the user
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  const token = useSelector((state) => state.auth.token);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await sendMessageToAdmin(message, email);

      if (res.data.success) {
        toast.success("Your message has been sent successfully!");
        setMessage(""); // Clear the message input after successful submission
        setEmail("");
      } else {
        toast.error(res.response?.data?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Admin
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-6">
          Send a message to the admin to request a review of your account
          status.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Message Input */}
          <div className="flex flex-col gap-2   ">
            <label>Email:</label>
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              rows="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              required
            ></textarea>
          </div>
          <div className="flex flex-col gap-2   ">
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-medium bg-black rounded-md hover:bg-gray-800 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                Sending{" "}
                <LoaderCircle className="size-4 inline-flex animate-spin ml-2" />
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactAdmin;
