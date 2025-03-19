import "./AIGuessYourMain.css";

function AIGuessYourMain() {
    return (
        <div className="ai-guess-container">
            <h2 className="title">Let AI guess your main</h2>
            <p className="subtitle">Answer the AI's questions and see if it can figure out your main champion!</p>
            <div className="chatbox">
                {/* Render chat history or questions here */}
            </div>
            <div className="input-area">
                <input type="text" placeholder="Type your answer..." className="user-input" />
                <button className="submit-btn">Send</button>
            </div>
            <div className="guess-area">
                <h3>Current Guess:</h3>
                <p className="current-guess">None yet...</p>
            </div>
        </div>
    );
}

export default AIGuessYourMain;