import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // { role: 'user' | 'model', parts: [{ text: string }] }

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", parts: [{ text: input }] };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await axios.post("http://localhost:5000/api/chat/message", {
                message: input,
                history: messages,
            });

            const botMessage = { role: "model", parts: [{ text: res.data.text }] };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        {msg.parts[0].text}
                    </div>
                ))}
            </div>
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask about land auctions..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;