import "./AIGuessYourMain.css";
import axios from "axios";
import { useState } from "react";

function AIGuessYourMain() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("None yet...");

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to chat history
        setChatHistory((prev) => [...prev, { sender: "user", message: input }]);

        try {
            const response = await axios.post("My_Railway_API", {
                question: input,
                previousContext: chatHistory.map((msg) => `${msg.sender}: ${msg.message}`).join("\n"),
            });

            // Add AI response to chat history
            setChatHistory((prev) => [...prev, { sender: "ai", message: response.data.aiReply }]);

            // Optionally update current guess if the AI mentions one
            if (response.data.aiReply.toLowerCase().includes("i think your champion is")) {
                const guess = response.data.aiReply.split("I think your champion is")[1].split(".")[0].trim();
                setCurrentGuess(guess);
            }
        } catch (err) {
            console.error("Error communicating with AI:", err);
            setChatHistory((prev) => [...prev, { sender: "ai", message: "Error: failed to get response from AI." }]);
        }

        setInput("");
    };

    return (
        <div className="ai-guess-container">
            <h2 className="title">Let AI guess your main</h2>
            <p className="subtitle">Answer the AI's questions and see if it can figure out your main champion!</p>

            <div className="chatbox">
                {chatHistory.map((entry, index) => (
                    <div key={index} className={`chat-entry ${entry.sender}`}>
                        <strong>{entry.sender === "user" ? "You: " : "AI: "}</strong>
                        {entry.message}
                    </div>
                ))}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type your answer..."
                    className="user-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="submit-btn" onClick={handleSend}>Send</button>
            </div>

            <div className="guess-area">
                <h3>Current Guess:</h3>
                <p className="current-guess">{currentGuess}</p>
            </div>
        </div>
    );
}

export default AIGuessYourMain;
