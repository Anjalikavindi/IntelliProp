import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        messages: newMessages,
      });
      setMessages([...newMessages, response.data]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px', border: '1px solid #ccc', background: '#fff', padding: '10px', borderRadius: '8px' }}>
      <div className="chat-window" style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '5px' }}>
            <span style={{ background: msg.role === 'user' ? '#007bff' : '#f1f1f1', color: msg.role === 'user' ? '#fff' : '#000', padding: '5px 10px', borderRadius: '10px' }}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p>Thinking...</p>}
      </div>
      <div style={{ display: 'flex' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask IntelliProp..." 
          style={{ flex: 1, padding: '5px' }}
        />
        <button onClick={handleSend} style={{ padding: '5px 10px' }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;