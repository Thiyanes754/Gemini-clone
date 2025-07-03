import { createContext, useState } from "react";
import runChat from "../components/config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Store multiple conversations
  const [conversations, setConversations] = useState([
    { title: "New Chat", history: [] },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ➕ Create a new chat thread
  const createNewChat = () => {
    const newChat = { title: "New Chat", history: [] };
    setConversations((prev) => [...prev, newChat]);
    setCurrentIndex(conversations.length); // new index
  };

  // 🔁 Switch between chat threads
  const selectConversation = (index) => {
    setCurrentIndex(index);
  };

  // ✏️ Edit a conversation title
  const editTitle = (index, newTitle) => {
    const updated = [...conversations];
    updated[index].title = newTitle;
    setConversations(updated);
  };

  // ❌ Delete a conversation
  const deleteConversation = (index) => {
    const updated = [...conversations];
    updated.splice(index, 1);
    setConversations(updated);

    if (updated.length === 0) {
      // If all deleted, create a fresh one
      setConversations([{ title: "New Chat", history: [] }]);
      setCurrentIndex(0);
    } else {
      // Move to previous or first chat
      setCurrentIndex(Math.max(0, index - 1));
    }
  };

  // 📤 Send prompt to Gemini
  const onSent = async (prompt) => {
    try {
      setLoading(true);
      const response = await runChat(prompt);

      const updated = [...conversations];
      const currentConv = updated[currentIndex];

      // ⬇️ Add prompt-response pair
      currentConv.history.push({ prompt, response });

      // 📝 Replace "New Chat" title with prompt (only on first msg)
      if (
        currentConv.title === "New Chat" ||
        currentConv.title.trim() === "" ||
        currentConv.history.length === 1
      ) {
        const trimmedPrompt =
          prompt.length > 30 ? prompt.slice(0, 30).trim() + "..." : prompt;
        currentConv.title = trimmedPrompt;
      }

      setConversations(updated);
      setLoading(false);
    } catch (error) {
      const updated = [...conversations];
      updated[currentIndex].history.push({
        prompt,
        response: "❌ Gemini Error: " + error.message,
      });
      setConversations(updated);
      setLoading(false);
    }
  };

  return (
    <Context.Provider
      value={{
        input,
        setinput,
        onSent,
        loading,
        conversations,
        currentIndex,
        createNewChat,
        selectConversation,
        deleteConversation,
        editTitle,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
