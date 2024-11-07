"use client";
import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    if (connected) {
      ws.current = new WebSocket("https://websocket-test.liara.run/");

      ws.current.onopen = () => {
        console.log("Connected");
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.current.onclose = () => {
        console.log("Disconnected");
      };

      return () => {
        ws.current.close();
      };
    }
  }, [connected]);

  const sendMessage = () => {
    if (ws.current && input && username) {
      const message = {
        text: input,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
      };
      ws.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  const handleConnect = () => {
    if (username.trim()) {
      setConnected(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && input.trim()) {
      sendMessage();
    }
  };

  return (
    <div
      dir="rtl"
      className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-6 text-black">
        برنامه چت
      </h2>
      {!connected ? (
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-3/4 p-2 border border-gray-300 rounded-lg mr-2 text-black"
          />
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            اتصال
          </button>
        </div>
      ) : (
        <div>
          <div className="message-box border border-gray-300 p-4 h-72 overflow-y-auto bg-gray-50 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col mb-3 ${
                  message.sender === username ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === username
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <span className="font-bold mr-1">{message.sender}</span>
                  <span className="text-sm text-gray-300 ml-1">
                    [{message.timestamp}]
                  </span>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-4 gap-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="پیام خود را بنویسید"
              className="w-3/4 p-2 border border-gray-300 rounded-lg mr-2 text-black"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`w-1/4 p-2 rounded-lg transition ${
                input.trim()
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              ارسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
