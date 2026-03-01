import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with IntelliProp today?", sender: "bot" },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { text: input, sender: "user" };
    // Update UI immediately with user's message
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Double check your Flask port. Is it 8000 or 5000?
      // Based on your previous logs, ML-service is on 8000.
      const res = await axios.post("http://127.0.0.1:8000/api/chat", {
        message: currentInput,
      });

      if (res.data.reply) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.reply, sender: "bot" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: "The IntelliProp service is currently offline. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">IntelliProp Assistant</div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {isLoading && <div className="message bot typing">Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <img
            src="/message.png" /* Ensure this matches your actual logo filename in /public */
            alt="IntelliProp Logo"
            className="chatbot-logo-img"
          />
        )}
      </button>
    </div>
  );
};

export default ChatBot;
