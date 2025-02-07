import kaboom from "kaboom";

let kaboomInstance = null; // Global variable to track instanc

export function startGame(container) {
    if (!container) return;

    if (kaboomInstance) {
        console.warn("Kaboom instance already exists. Skipping new instance.");
        return; // Prevent duplicate game instances
    }

    kaboomInstance = kaboom({
        global: false,
        width: 600,
        height: 720,
        root: container,
    });

    kaboomInstance.setGravity(2400);

    kaboomInstance.loadSprite("background", "/assets/game-background.png");
    
    kaboomInstance.add([
        kaboomInstance.sprite("background"), // Set as background
        kaboomInstance.pos(-115, 0), // Position it at the top-left
        kaboomInstance.scale(0.75), // Adjust size if needed
    ]);

    kaboomInstance.loadSprite("draven", "/assets/draven_head.png");

    const ground = kaboomInstance.add([ 
        kaboomInstance.rect(600, 50), //  Full-width platform
        kaboomInstance.pos(0, 720),   //  Position at bottom
        kaboomInstance.color(100, 100, 100), // Gray color
        kaboomInstance.area(), //  Enables collision detection
        kaboomInstance.body({ isStatic: true }), //  Make it static so it doesn't fall
    ]);

    const draven = kaboomInstance.add([
        kaboomInstance.sprite("draven"), //  Correct way
        kaboomInstance.pos(80, 40),
        kaboomInstance.area(),
        kaboomInstance.body(),
    ]);

    kaboomInstance.onKeyPress("space", () => {
        // this method is provided by the "body" component above
        draven.jump()
    })
}