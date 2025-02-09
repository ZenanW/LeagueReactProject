import Phaser from "phaser";

export function startGame(container) {
    if (!container) return;

    if (container.phaserGame) {
        console.warn("Phaser game already exists. Skipping new instance.");
        return;
    }

    const config = {
        type: Phaser.AUTO,
        width: 600,
        height: 720,
        parent: container,
        physics: {
            default: "matter",
            matter: {
                gravity: { y: 1 },
                debug: true, // Show hitboxes for debugging
            },
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };

    container.phaserGame = new Phaser.Game(config);
}

let isDropped = false;
const bounceFactor = 0.6;
let items = []; // Stores all items

function preload() {
    this.load.image("background", "/assets/game-background.png");
    this.load.image("long_sword", "/assets/AD_items/Long_Sword-modified.png");
}

function create() {
    // Add background
    this.add.image(300, 360, "background").setScale(0.75);

    // Set game boundaries and enable bottom collision
    this.matter.world.setBounds(0, 0, 600, 720);

    generateNewItem(this); // Generate the first item

    this.cursors = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        drop: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Drop the latest item when SPACE is pressed
    this.input.keyboard.on("keydown-SPACE", () => {
        if (!isDropped && items.length > 0) {
            let latestItem = items[items.length - 1];
            latestItem.setStatic(false); // Enable physics
            isDropped = true; // Mark as dropped
        }
    });

    // Collision detection: Runs continuously
    this.matter.world.on("collisionstart", (event) => {
        event.pairs.forEach((pair) => {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;

            let itemA = items.find((item) => item.body === bodyA);
            let itemB = items.find((item) => item.body === bodyB);

            // If two different items collide, trigger a merge or spawn
            if (itemA && itemB && itemA !== itemB) {
                if (!itemA.hasSpawnedNext && !itemB.hasSpawnedNext) {
                    console.log("Item collision detected!");
                    itemA.hasSpawnedNext = true;
                    itemB.hasSpawnedNext = true;
                    generateNewItem(this);
                }
            }
        });
    });
}

function update() {
    let latestItem = items[items.length - 1];

    // Move latest item before dropping
    if (!isDropped && latestItem) {
        if (this.cursors.left.isDown && latestItem.x > 25) {
            latestItem.x -= 5;
        } else if (this.cursors.right.isDown && latestItem.x < 575) {
            latestItem.x += 5;
        }
    }

    // Check if last dropped item has landed and generate a new one
    if (
        isDropped &&
        latestItem &&
        latestItem.body.velocity.y < 0.1 &&
        !latestItem.hasSpawnedNext
    ) {
        latestItem.hasSpawnedNext = true; // Prevent multiple spawns
        console.log("Item landed. Generating new item...");
        setTimeout(() => generateNewItem(this), 300); // Small delay to avoid instant spawns
    }
}

// Generates a new item when needed
function generateNewItem(scene) {
    let newItem = scene.matter.add.image(300, 200, "long_sword", null, {
        shape: "circle",
        restitution: bounceFactor,
        density: 0.001,
        friction: 0.98,
        collisionFilter: {
            category: 0x0001,  // Assign category for all items
            mask: 0x0001       // Allow items to collide with each other
        }
    });

    newItem.setScale(0.8);
    newItem.setStatic(true); // Not dropped initially
    newItem.hasSpawnedNext = false; // Reset spawn state for each new item
    isDropped = false; // Reset drop state

    items.push(newItem); // Store in items array
}


