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
        scene: [MenuScene, GameScene],
    };

    container.phaserGame = new Phaser.Game(config);
}

// Store selected item type globally
let selectedItemSet = "AD";

// **Menu Scene (Start Menu)**
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    preload() {
        this.load.image("background", "/assets/game-background.png");
        this.load.image("button_ad", "/assets/ADButton.png");
        this.load.image("button_ap", "/assets/APButton.png");
        this.load.image("button_armor", "/assets/ArmorButton.png");
    }

    create() {
        this.add.image(300, 360, "background").setScale(0.75);

        let adButton = this.add.image(310, 180, "button_ad").setInteractive().setScale(0.4);
        let apButton = this.add.image(310, 380, "button_ap").setInteractive().setScale(0.4);
        let armorButton = this.add.image(310, 580, "button_armor").setInteractive().setScale(0.4);

        adButton.on("pointerdown", () => {
            selectedItemSet = "AD";
            this.scene.start("GameScene"); // Start game
        });

        apButton.on("pointerdown", () => {
            selectedItemSet = "AP";
            this.scene.start("GameScene"); // Start game
        });

        armorButton.on("pointerdown", () => {
            selectedItemSet = "Armor";
            this.scene.start("GameScene"); // Start game
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });

        // Define variables inside the class
        this.isDropped = false;
        this.bounceFactor = 0.6;
        this.items = [];
        this.lastDroppedItem = null;
    }

    preload() {
        this.load.image("background", "/assets/game-background.png");

        this.load.image("long_sword", "/assets/AD_items/Long_Sword-modified.png");
        this.load.image("pickaxe", "/assets/AD_items/Pickaxe-modified.png");
        this.load.image("caulfields_hammer", "/assets/AD_items/Caulfield_s_Warhammer-modified.png");
        this.load.image("BF_sword", "/assets/AD_items/B_F_Sword-modified.png");
        this.load.image("Youmuus_Ghostblade", "/assets/AD_items/Youmuu_s_Ghostblade-modified.png");
        this.load.image("Voltaic_Cyclosword", "/assets/AD_items/Voltaic_Cyclosword-modified.png");
        this.load.image("I.E", "/assets/AD_items/Edge_of_Finality-modified.png");

        this.load.image("wisp", "/assets/AP_items/Aether_Wisp-modified.png");
        this.load.image("tome", "/assets/AP_items/Amplifying_Tome-modified.png");
        this.load.image("wand", "/assets/AP_items/Blasting_Wand-modified.png");
        this.load.image("jewel", "/assets/AP_items/Blighting_Jewel-modified.png");
        this.load.image("chapter", "/assets/AP_items/Lost_Chapter-modified.png");
        this.load.image("arch_staff", "/assets/AP_items/Archangel_s_Staff-modified.png");
        this.load.image("gunblade", "/assets/AP_items/Hextech_Gunblade-modified.png");

        this.load.image("cloth_armor", "/assets/Armor_items/Cloth_Armor-modified.png");
        this.load.image("chain_vest", "/assets/Armor_items/Chain_Vest-modified.png");
        this.load.image("bramble_vest", "/assets/Armor_items/Bramble_Vest-modified.png");
        this.load.image("warden_mail", "/assets/Armor_items/Warden_s_Mail-modified.png");
        this.load.image("frozen_heart", "/assets/Armor_items/Frozen_Heart-modified.png");
        this.load.image("deadmans", "/assets/Armor_items/Dead_Man_s_Plate-modified.png");
        this.load.image("thornmail", "/assets/Armor_items/Thornmail-modified.png");

    }

    create() {
        // Add background
        this.add.image(300, 360, "background").setScale(0.75);

        // Set game boundaries and enable bottom collision
        this.matter.world.setBounds(0, 0, 600, 720);

        this.generateNewItem(); // Generate the first item

        this.cursors = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            drop: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Drop the generated item when SPACE is pressed
        this.input.keyboard.on("keydown-SPACE", () => {
            let generatedItem = this.items.find(item => item.isGenerated);
            if (generatedItem && generatedItem.body.isStatic) {
                generatedItem.setStatic(false);
                generatedItem.isGenerated = false;
                this.isDropped = true;
                this.lastDroppedItem = generatedItem;
            }
        });

        // Collision detection
        this.matter.world.on("collisionstart", (event) => {
            event.pairs.forEach((pair) => {
                let bodyA = pair.bodyA;
                let bodyB = pair.bodyB;

                let itemA = this.items.find(item => item.body === bodyA);
                let itemB = this.items.find(item => item.body === bodyB);

                if (itemA && itemB && itemA !== itemB) {
                    if (itemA.texture.key === "long_sword" && itemB.texture.key === "long_sword") {
                        this.mergeItems(itemA, itemB, "pickaxe");
                    } else if (itemA.texture.key === "pickaxe" && itemB.texture.key === "pickaxe") {
                        this.mergeItems(itemA, itemB, "caulfields_hammer");
                    } else if (itemA.texture.key === "caulfields_hammer" && itemB.texture.key === "caulfields_hammer") {
                        this.mergeItems(itemA, itemB, "BF_sword");
                    } else if (itemA.texture.key === "BF_sword" && itemB.texture.key === "BF_sword") {
                        this.mergeItems(itemA, itemB, "Youmuus_Ghostblade");
                    } else if (itemA.texture.key === "Youmuus_Ghostblade" && itemB.texture.key === "Youmuus_Ghostblade") {
                        this.mergeItems(itemA, itemB, "Voltaic_Cyclosword");
                    } else if (itemA.texture.key === "Voltaic_Cyclosword" && itemB.texture.key === "Voltaic_Cyclosword") {
                        this.mergeItems(itemA, itemB, "I.E");
                    } else if (itemA.texture.key === "tome" && itemB.texture.key === "tome") {
                        this.mergeItems(itemA, itemB, "wisp");
                    } else if (itemA.texture.key === "wisp" && itemB.texture.key === "wisp") {
                        this.mergeItems(itemA, itemB, "wand");
                    } else if (itemA.texture.key === "wand" && itemB.texture.key === "wand") {
                        this.mergeItems(itemA, itemB, "jewel");
                    } else if (itemA.texture.key === "jewel" && itemB.texture.key === "jewel") {
                        this.mergeItems(itemA, itemB, "chapter");
                    } else if (itemA.texture.key === "chapter" && itemB.texture.key === "chapter") {
                        this.mergeItems(itemA, itemB, "staff");
                    } else if (itemA.texture.key === "staff" && itemB.texture.key === "staff") {
                        this.mergeItems(itemA, itemB, "gunblade");
                    } else if (itemA.texture.key === "cloth_armor" && itemB.texture.key === "cloth_armor") {
                        this.mergeItems(itemA, itemB, "chain_vest");
                    } else if (itemA.texture.key === "chain_vest" && itemB.texture.key === "chain_vest") {
                        this.mergeItems(itemA, itemB, "bramble_vest");
                    } else if (itemA.texture.key === "bramble_vest" && itemB.texture.key === "bramble_vest") {
                        this.mergeItems(itemA, itemB, "warden_mail");
                    } else if (itemA.texture.key === "warden_mail" && itemB.texture.key === "warden_mail") {
                        this.mergeItems(itemA, itemB, "frozen_heart");
                    } else if (itemA.texture.key === "frozen_heart" && itemB.texture.key === "frozen_heart") {
                        this.mergeItems(itemA, itemB, "deadmans");
                    } else if (itemA.texture.key === "deadmans" && itemB.texture.key === "deadmans") {
                        this.mergeItems(itemA, itemB, "thornmail");
                    }
                }
            });
        });
    }

    update() {
        let generatedItem = this.items.find(item => item.isGenerated);

        if (generatedItem) {
            if (this.cursors.left.isDown && generatedItem.x > 25) {
                generatedItem.x -= 5;
            } else if (this.cursors.right.isDown && generatedItem.x < 575) {
                generatedItem.x += 5;
            }
        }

        if (!generatedItem && this.isDropped && this.lastDroppedItem) {
            if (!this.lastDroppedItem.hasSpawnedNext) {
                this.lastDroppedItem.hasSpawnedNext = true;
                console.log("Item landed. Generating new item...");
                this.time.delayedCall(1000, () => {
                    this.generateNewItem();
                });
            }
        }
    }

    generateNewItem() {
        let itemMap = {
            "AD": "long_sword",
            "AP": "tome",
            "Armor": "cloth_armor"
        };
    
        // Select the correct item based on `selectedItemSet`
        let itemTexture = itemMap[selectedItemSet] || "long_sword"; // Default to "long_sword" if undefined
    
        let newItem = this.matter.add.image(300, 200, itemTexture, null, {
            shape: "circle",
            restitution: this.bounceFactor,
            density: 0.001,
            friction: 0.98,
        });

        newItem.setScale(0.9);
        newItem.setStatic(true);
        newItem.isGenerated = true;
        newItem.hasSpawnedNext = false;

        this.items.push(newItem);
        this.isDropped = false;
        this.lastDroppedItem = null;
    }

    handleItemMerge(itemA, itemB) {
        let mergeMap = {
            "long_sword": "pickaxe",
            "pickaxe": "caulfields_hammer",
            "caulfields_hammer": "BF_sword",
            "BF_sword": "Youmuus_Ghostblade",
            "Youmuus_Ghostblade": "Voltaic_Cyclosword",
            "Voltaic_Cyclosword": "I.E",
            "tome": "tome",
            "wisp": "wisp",
            "wand": "wand",
            "jewel": "jewel",
            "chapter": "chapter",
            "staff": "arch_staff",
            "gunblade": "gunblade",
            "cloth_armor": "cloth_armor",
            "chain_vest": "chain_vest",
            "bramble_vest": "bramble_vest",
            "warden_mail": "warden_mail",
            "frozen_heart": "frozen_heart",
            "deadmans": "deadmans",
            "thornmail": "thornmail"
        };

        if (mergeMap[itemA.texture.key] === itemB.texture.key) {
            this.mergeItems(itemA, itemB, mergeMap[itemA.texture.key]);
        }
    }

    mergeItems(itemA, itemB, newTexture) {
        let newX = (itemA.x + itemB.x) / 2;
        let newY = (itemA.y + itemB.y) / 2;

        this.matter.world.remove(itemA);
        this.matter.world.remove(itemB);

        itemA.destroy();
        itemB.destroy();

        this.items = this.items.filter(item => item !== itemA && item !== itemB);

        // **Separate scaling for different item sets**
        const adScaling = {
            "pickaxe": 1.4,
            "caulfields_hammer": 1.8,
            "BF_sword": 2.2,
            "Youmuus_Ghostblade": 2.6,
            "Voltaic_Cyclosword": 3.0,
            "I.E": 3.8
        };

        const apScaling = {
            "wisp": 1.4,
            "wand": 1.8,
            "jewel": 2.2,
            "chapter": 2.6,
            "staff": 3.0,
            "gunblade": 3.8
        };

        const armorScaling = {
            "chain_vest": 1.6,
            "bramble_vest": 2.0,
            "warden_mail": 2.4,
            "frozen_heart": 2.8,
            "deadmans": 3.2,
            "thornmail": 3.8
        };

        let scalingFactor = adScaling[newTexture] || apScaling[newTexture] || armorScaling[newTexture] || 1;

        let newItem = this.matter.add.image(newX, newY, newTexture, null, {
            shape: "circle",
            restitution: this.bounceFactor,
            density: 0.001,
            friction: 0.98,
        });

        newItem.setScale(scalingFactor);
        newItem.setStatic(false);
        this.items.push(newItem);
    }
}


