import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/chat', { prompt: input });
      setMessages([...newMessages, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'bot', text: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px', position: 'fixed', bottom: '20px', right: '20px', background: '#fff' }}>
      <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '5px' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
        {loading && <p>Thinking...</p>}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask about properties..." 
        style={{ width: '80%' }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;