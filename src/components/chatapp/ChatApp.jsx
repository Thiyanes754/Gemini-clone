import React, { useContext } from "react";
import "./ChatApp.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/ContextProvider";
import { marked } from "marked";

const ChatApp = () => {
  const { input, setinput, onSent, loading, conversations, currentIndex } =
    useContext(Context);

  const handleSend = () => {
    if (input.trim() !== "" && currentIndex !== null) {
      onSent(input);
      setinput("");
    }
  };

  const currentHistory =
    currentIndex !== null && conversations[currentIndex]
      ? conversations[currentIndex].history
      : [];

  const handleSuggestion = (text) => {
    setinput(text);
    if (currentIndex !== null) {
      onSent(text);
    }
  };

  return (
    <div className="main">
      {/* Top Nav */}
      <div className="nav">
        <p>Gemini✨</p>
        <img src={assets.user} alt="user" />
      </div>

      {/* Main Area */}
      <div className="main-container">
        {/* Default Greeting */}
        {currentHistory.length === 0 && !loading && (
          <>
            <div className="greet">
              <p>
                <span>Hello, Developer</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              {[
                "🌍 Suggest beautiful places to visit...",
                "🧠 Explain how the human brain learns...",
                "📱 Give me a unique app idea...",
                "🎬 Recommend some underrated movies...",
              ].map((item, idx) => (
                <div
                  className="card"
                  key={idx}
                  onClick={() => handleSuggestion(item)}
                >
                  <p>{item}</p>
                  <img src={assets.message_icon} alt="icon" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Chat History */}
        {currentHistory.map((item, index) => (
          <div className="response-box" key={index}>
            {/* User Prompt */}
            <div className="user-line">
              <img src={assets.user} alt="user" className="chat-user-icon" />
              <p><strong>{item.prompt}</strong></p>
            </div>

            {/* Gemini Response */}
            <div className="ai-line">
              <img
                src={assets.gemini_icon}
                alt="gemini"
                className="chat-user-icon"
              />
              <div
                className="markdown"
                dangerouslySetInnerHTML={{ __html: marked(item.response) }}
              />
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className="response-box">
            <div className="loader">
              <hr />
              <hr />
              <hr />
            </div>
          </div>
        )}

        {/* Prompt Input Area */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="gallery" />
              <img src={assets.mic_icon} alt="mic" />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info. Please verify before use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
