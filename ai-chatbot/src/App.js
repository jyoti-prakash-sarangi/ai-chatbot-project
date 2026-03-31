import React, { useState } from "react";

function App() {
  const [chats, setChats] = useState([
    { id: 1, messages: [] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMsg = { text: input, sender: "user" };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat
      )
    );

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-chatbot-backend-6sf1.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMsg = { text: data.reply, sender: "bot" };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, botMsg] }
            : chat
        )
      );

    } catch (error) {
      const errorMsg = { text: "Error 😢", sender: "bot" };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMsg] }
            : chat
        )
      );
    }

    setLoading(false);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#343541", color: "white" }}>
      
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#202123", padding: "10px" }}>
        <button
          onClick={createNewChat}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #444",
            borderRadius: "5px",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          + New Chat
        </button>

        {/* Chat List */}
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: chat.id === currentChatId ? "#343541" : "transparent",
              borderRadius: "5px",
              marginBottom: "5px"
            }}
          >
            Chat {chat.id.toString().slice(-4)}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Messages */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          
          {currentChat.messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "15px"
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: msg.sender === "user" ? "#19c37d" : "#444654",
                  color: "white",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#444654",
                  padding: "12px",
                  borderRadius: "10px"
                }}
              >
                Typing...
              </div>
            </div>
          )}

        </div>

        {/* Input */}
        <div style={{ padding: "15px", borderTop: "1px solid #444" }}>
          <div style={{ display: "flex", background: "#40414f", borderRadius: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Send a message..."
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "white"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "12px 20px",
                background: "#19c37d",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;