import React from "react";
import { useEffect, useRef } from "react";
import './ItemMiniGame.css'
import { startGame } from './merge-item-game/merge-item-game'

const ItemMiniGame = () => {
    const gameContainer = useRef(null); // Create a reference to a div

    useEffect(() => {
        startGame(gameContainer.current); // Pass the div reference to startGame()
    }, []);

    return (
        <section className="item-mini-game">
            <div className="page-container">
                <h1>ItemMiniGame</h1> 
                <div className="mini-game">
                    <div ref={gameContainer} style={{ width: "600px", height: "720px" }} />
                </div>
            </div>
        </section>
    )
}

export default ItemMiniGame