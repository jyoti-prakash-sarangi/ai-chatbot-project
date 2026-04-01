import React, { useState, useRef, useEffect } from "react";
import Auth from "./Auth";

function App() {
  // 🔐 Auth state
  const [user, setUser] = useState(null);

  // 💬 Chat system
  const [chats, setChats] = useState([
    { id: 1, messages: [] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  // 🔥 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
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

  // 🔐 SHOW LOGIN FIRST
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button onClick={createNewChat} style={styles.newChatBtn}>
          + New Chat
        </button>

        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#aaa" }}>
          Logged in as: {user.email}
        </div>

        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            style={{
              ...styles.chatItem,
              background: chat.id === currentChatId ? "#343541" : "transparent"
            }}
          >
            Chat {chat.id.toString().slice(-4)}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>

        <div style={styles.messages}>
          {currentChat.messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                ...styles.message,
                background: msg.sender === "user" ? "#19c37d" : "#444654"
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex" }}>
              <div style={styles.botTyping}>Typing...</div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Send a message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#343541",
    color: "white"
  },
  sidebar: {
    width: "260px",
    background: "#202123",
    padding: "10px"
  },
  newChatBtn: {
    padding: "10px",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    marginBottom: "10px"
  },
  chatItem: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "5px",
    transition: "0.2s"
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  message: {
    maxWidth: "60%",
    padding: "12px 14px",
    borderRadius: "12px",
    whiteSpace: "pre-wrap",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  },
  botTyping: {
    background: "#444654",
    padding: "12px",
    borderRadius: "10px"
  },
  inputArea: {
    padding: "15px",
    borderTop: "1px solid #444"
  },
  input: {
    width: "85%",
    padding: "12px",
    border: "none",
    outline: "none",
    background: "#40414f",
    color: "white",
    borderRadius: "8px"
  },
  sendBtn: {
    padding: "12px 18px",
    marginLeft: "10px",
    background: "#19c37d",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default App;