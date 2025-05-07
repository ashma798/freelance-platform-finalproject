import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig/axiosConfig";
import socket from "../../socket";

const Chat = ({ receiverId, onClose }) => {
  const [receiverData, setReceiverData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [openChat, setOpenChat] = useState(true);

  const user = JSON.parse(localStorage.getItem("@user"));

  // Fetch receiver data (Freelancer or Client)
  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const result = await axiosInstance.get(`/users/getUsers/${receiverId}`);
        const { _id, name } = result.data.data;
        setReceiverData({ _id, name });
      } catch (err) {
        console.error("Error fetching receiver data:", err);
      }
    };

    if (receiverId) {
      fetchReceiverData();
    }
  }, [receiverId]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        socket.emit("join", user._id);
      }, 1000);     }
  }, [user]);

  // Receive messages
  useEffect(() => {
    const handleReceive = (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);

      if (!openChat) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => socket.off("receiveMessage", handleReceive);
  }, [openChat]);

  // Send message
  const sendMessage = () => {
    if (text.trim() && receiverData) {
      const messageData = {
        senderId: user._id,
        senderName: user.name,
        receiverId: receiverData._id,
        receiverName: receiverData.name,
        content: text,
        timestamp: new Date(),
      };
      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setText("");
    }
  };

  // Auto-scroll to latest message when new messages arrive
  useEffect(() => {
    const chatBox = document.querySelector(".flex-1");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
        <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Chat with {receiverData?.name}</h2>
          <button onClick={onClose} className="text-white text-xl">
            &times;
          </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm px-3 py-1 rounded-lg max-w-xs ${
                msg.senderId === user._id
                  ? "bg-blue-100 text-right self-end ml-auto"
                  : "bg-gray-100 text-left"
              }`}
            >
              <div>
                <strong>{msg.senderName}</strong>
              </div>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="p-3 flex items-center border-t border-gray-300">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
