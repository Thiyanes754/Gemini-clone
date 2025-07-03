import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/ContextProvider";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    conversations,
    currentIndex,
    createNewChat,
    selectConversation,
    deleteConversation,
    editTitle,
  } = useContext(Context);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setExtended((prev) => !prev);
    }
  };

  
  const handleSelectConversation = (index) => {
    selectConversation(index);
    if (isMobile) setIsMobileOpen(false);
  };

  return (
    <div
      className={`sidebar ${extended ? "" : "collapsed"} ${
        isMobileOpen ? "mobile-open" : ""
      }`}
    >
      <div className="top">
        <img
          src={assets.menu_icon}
          alt="menu"
          className="menu"
          onClick={handleToggle}
        />

        <div className="new-chat" onClick={createNewChat}>
          <img src={assets.plus_icon} alt="plus" />
          {extended && !isMobile && <p>New Chat</p>}
        </div>

        {extended && !isMobile && (
          <div className="recent">
            <p className="recent-title">Conversations</p>
            {conversations.map((conv, index) => (
              <div
                className={`recent-entry ${
                  index === currentIndex ? "active" : ""
                }`}
                key={index}
                onClick={() => handleSelectConversation(index)}
              >
                <img src={assets.message_icon} alt="msg" />
                <p>{conv.title}</p>

                <div className="entry-actions">
                  <img
                    src={assets.edit_icon}
                    alt="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTitle = prompt("Edit title:", conv.title);
                      if (newTitle?.trim()) editTitle(index, newTitle);
                    }}
                  />
                  <img
                    src={assets.delete_icon}
                    alt="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(index);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="help" />
          {extended && !isMobile && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="activity" />
          {extended && !isMobile && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="settings" />
          {extended && !isMobile && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
