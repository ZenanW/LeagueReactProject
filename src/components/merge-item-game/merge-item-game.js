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
                // debug: true, // Show hitboxes for debugging
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
    this.load.image("pickaxe", "/assets/AD_items/Pickaxe-modified.png");
    this.load.image("caulfields_hammer", "/assets/AD_items/Caulfield_s_Warhammer-modified.png");
    this.load.image("BF_sword", "/assets/AD_items/B_F_Sword-modified.png");
    this.load.image("Youmuus_Ghostblade", "/assets/AD_items/Youmuu_s_Ghostblade-modified.png");
    this.load.image("Voltaic_Cyclosword", "/assets/AD_items/Voltaic_Cyclosword-modified.png");
    this.load.image("I.E", "/assets/AD_items/Edge_of_Finality-modified.png");
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

    // Drop the generated item when SPACE is pressed
    this.input.keyboard.on("keydown-SPACE", () => {
        let generatedItem = items.find(item => item.isGenerated); // Get the currently controllable item
        if (generatedItem && generatedItem.body.isStatic) {
            generatedItem.setStatic(false); // Enable physics
            generatedItem.isGenerated = false; // It's now a regular object
            isDropped = true; // Track that an item has been dropped
            lastDroppedItem = generatedItem; // Track it for landing detection
        }
    });

    // Collision detection
    this.matter.world.on("collisionstart", (event) => {
        event.pairs.forEach((pair) => {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;

            let itemA = items.find((item) => item.body === bodyA);
            let itemB = items.find((item) => item.body === bodyB);

            if (itemA && itemB && itemA !== itemB) {
                if (itemA.texture.key === "long_sword" && itemB.texture.key === "long_sword") {
                    mergeItems(this, itemA, itemB, "pickaxe");
                } else if (itemA.texture.key === "pickaxe" && itemB.texture.key === "pickaxe") {
                    mergeItems(this, itemA, itemB, "caulfields_hammer");
                }
            }
        });
    });
}

let lastDroppedItem = null; // Track the last dropped item separately

function update() {
    let generatedItem = items.find(item => item.isGenerated); // Find the controllable item

    // Move only the generated item before dropping
    if (generatedItem) {
        if (this.cursors.left.isDown && generatedItem.x > 25) {
            generatedItem.x -= 5;
        } else if (this.cursors.right.isDown && generatedItem.x < 575) {
            generatedItem.x += 5;
        }
    }

    // Track the last dropped item separately
    if (!generatedItem && isDropped && lastDroppedItem) {
        if (lastDroppedItem.body.velocity.y < 0.1 && !lastDroppedItem.hasSpawnedNext) {
            lastDroppedItem.hasSpawnedNext = true; // Prevent multiple spawns
            console.log("Item landed. Generating new item...");
            this.time.delayedCall(1000, () => {
                generateNewItem(this);
            });
        }
    }
}


//  Generates a new item when needed
function generateNewItem(scene) {
    let newItem = scene.matter.add.image(300, 200, "long_sword", null, {
        shape: "circle",
        restitution: bounceFactor,
        density: 0.001,
        friction: 0.98,
        collisionFilter: {
            category: 0x0001,
            mask: 0x0001
        }
    });

    newItem.setScale(0.9);
    newItem.setStatic(true); // Start as static, waiting for player to drop
    newItem.hasSpawnedNext = false;
    newItem.isGenerated = true; // Mark it as a generated item
    newItem.formFromCollision = false; // Not from merging

    items.push(newItem); // Store in items array

    isDropped = false; // Reset drop state
    lastDroppedItem = null; // Reset last dropped item tracker
}

function mergeItems(scene, itemA, itemB, newTexture) {
    // Find the midpoint of the two items
    let newX = (itemA.x + itemB.x) / 2;
    let newY = (itemA.y + itemB.y) / 2;

    // Remove old items
    scene.matter.world.remove(itemA);
    scene.matter.world.remove(itemB);

    itemA.destroy();
    itemB.destroy();

    items = items.filter(item => item !== itemA && item !== itemB);

    // Create the new merged item
    let newItem = scene.matter.add.image(newX, newY, newTexture, null, {
        shape: "circle",
        restitution: bounceFactor,
        density: 0.001,
        friction: 0.98,
        collisionFilter: {
            category: 0x0001,
            mask: 0x0001
        }
    });

    if (newTexture == "pickaxe") {
        newItem.setScale(1.4);
    } else if (newTexture == "caulfields_hammer") {
        newItem.setScale(1.8);
    }
    
    newItem.formFromCollision = true;
    newItem.setStatic(false); // Allow it to fall
    items.push(newItem); // Store in items array 
}


