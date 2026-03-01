import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle window
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm the IntelliProp AI Assistant. How can I assist you with Sri Lankan properties today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const botIconPath = "/message.png";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return; // Prevent sending if empty or already loading

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/chat', { prompt: input });
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      console.error("Frontend Chat Error:", error);
      setMessages((prev) => [...prev, { role: 'bot', text: "I'm having trouble reaching the server. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="chatbot-toggle-btn pulse" onClick={() => setIsOpen(true)}>
          <img src={botIconPath} alt="Chat Icon" className="toggle-icon-img" />
          <span>Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>IntelliProp AI</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div ref={scrollRef} className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chatbot-loading">IntelliProp is thinking...</div>}
          </div>

          <div className="chatbot-input-area">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={loading ? "Waiting for AI..." : "Ask about properties..."} 
              disabled={loading} // Disable input while loading
            />
            <button 
              className="chatbot-send-btn" 
              onClick={handleSend}
              disabled={loading || !input.trim()} // Disable button while loading or empty
              style={{ opacity: (loading || !input.trim()) ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;