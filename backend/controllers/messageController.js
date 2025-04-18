const Message = require("../models/messageModel");
const User = require("../models/userModel");

// @desc    Send a message to the admin
// @route   POST /api/messages/send
// @access  Private (Suspended users only)
const sendMessage = async (req, res) => {
  const { message, email } = req.body;

  try {
    // Check if the user is suspended
    if (!email || !message) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the credentials",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "You can't contact admin." });
    }

    if (user.status !== "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Only suspended users can send message",
      });
    }

    // Create a new message
    const newMessage = new Message({
      userId: user._id,
      message,
      senderName: user.name,
      senderEmail: user.email,
    });

    await newMessage.save();
    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({
      success: false,
      message: "An unexpected erro occurred. Please try again later.",
    });
  }
};

// @desc    Get all messages (Admin only)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("userId", "name email");
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// @desc    Update message status (Admin only)
// @route   PUT /api/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!id || !status) {
      return res.status(400).json({ success: false, message: "Invalid Input" });
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Message status updated.",
      data: updatedMessage,
    });
  } catch (error) {
    console.log("Error in updateMessageStatus controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};
// @desc    Delete message  (Admin only)
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  //   const { status } = req.body;
  try {
    const message = await Message.findById(id);
    if (!message) {
      res.status(404).json({ success: false, message: "Message Not Found!" });
    }

    await Message.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
};
