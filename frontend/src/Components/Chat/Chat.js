
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import axiosInstance from "../axiosConfig/axiosConfig";

// Create a single socket instance
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Chat = () => {
  const { freelancerId } = useParams();
  const [freelancerData, setFreelancerData] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  
  const user = JSON.parse(localStorage.getItem("@user"));
  
  // Add user to socket when they are authenticated
  useEffect(() => {
    if (user) {
      socket.emit("addUser", user._id);
    } else {
      console.error("User not found in localStorage!");
    }

    return () => {
      socket.disconnect(); // Clean up socket connection when the component unmounts
    };
  }, [user]);

  // Open chat automatically when freelancerId is present
  useEffect(() => {
    setOpenChat(true);
  }, [freelancerId]);

  // Fetch freelancer data
  useEffect(() => {
    const fetchFreelancerName = async () => {
      try {
        const result = await axiosInstance.get(`/users/freelancerProfile/${freelancerId}`);
        console.log("free data:",result);
        setFreelancerData(result.data.data);
        const { id, name } = result.data.data;
      setFreelancerData({ id: id, name });
    
      } catch (err) {
        console.error('Error fetching freelancer profile:', err);
      }
    };

    if (freelancerId) {
      fetchFreelancerName();
    }
  }, [freelancerId]);

  // Receive messages from the socket
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send a new message
  const sendMessage = () => {
    if (text.trim()) {
      const messageData = {
        senderId: user._id,
        senderName : user.name,
        receiverId: freelancerData.id,
        receiverName : freelancerData.name,
        content: text,
        timestamp: new Date(),
      };
      socket.emit('sendMessage', messageData); // Send message via socket
      setMessages((prev) => [...prev, messageData]); // Add message to local state
      setText(""); // Clear input field
    }
  };
  const toggleChat = (id) => {
    
    setOpenChat(!openChat);
  };
  
  return (
    <>
      {openChat && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button onClick={()=>toggleChat(freelancerData?._id)} className="text-white text-xl">&times;</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <b>{msg.sender}</b>: {msg.content}
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
      )}
    </>
  );
};

export default Chat;
