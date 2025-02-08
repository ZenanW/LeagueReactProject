import Phaser from "phaser";

export function startGame(container) {
    if (!container) return; // Ensure container exists before mounting Phaser

    // If there's already a Phaser game, don't create a new one
    if (container.phaserGame) {
        console.warn("Phaser game already exists. Skipping new instance.");
        return;
    }

    const config = {
        type: Phaser.AUTO,
        width: 600,
        height: 720,
        parent: container, // Attach Phaser to the React JSX div
        physics: {
            default: "matter", // Uses Matter.js for physics
            matter: {
                gravity: { y: 1 }, // Enables physics gravity
                // debug: true, // Show hitboxes for debugging
            },
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };

    // Store Phaser game instance in the container (so we don't re-create it)
    container.phaserGame = new Phaser.Game(config);
}

let long_sword;
let ground;
const bounceFactor = 0.6; // Energy lost per bounce

function preload() {
    this.load.image("background", "/assets/game-background.png");
    this.load.image("long_sword", "/assets/AD_items/Long_Sword.png");
}

function create() {
    // Add background
    this.add.image(300, 360, "background").setScale(0.75);

    this.matter.world.setBounds(0, 0, 600, 720);

    // Add long_sword as a **true circular physics object**
    long_sword = this.matter.add.image(300, 200, "long_sword", null, {
        shape: "circle", // Circular hitbox
        restitution: bounceFactor, // Controls bounciness
        density: 0.001, // Light object
        friction: 0.98, // Slows down horizontal movement
    });

    long_sword.setScale(0.8); // Adjust size if needed
    long_sword.setBounce(bounceFactor)

    // Make it jump when pressing space
    this.input.keyboard.on("keydown-SPACE", () => {
        long_sword.setVelocityY(-10); // Apply upward force
    });
}

function update() {
    // Ensures the object stays within bounds (optional)
    if (long_sword.y > 800) {
        long_sword.setPosition(300, 200); // Reset position if it falls off
        long_sword.setVelocity(0, 0);
    }
}
