// Variables
const fs = require('fs');
const canvas = require('./functions/canva');
const getLockfile = require('./functions/lockfile');
const createApi = require('./functions/createAPI');
const getInfoSkins = require('./functions/getInfoSkins');
const colors = require('colors');
// Classes
// Skin class
class Skin {
    constructor(startDate, endDate, skinId, champId, originalPrice, discountPrice, discountPercent, skinName, iconURL) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.skinId = skinId;
        this.champId = champId;
        this.originalPrice = originalPrice;
        this.discountPrice = discountPrice;
        this.discountPercent = discountPercent;
        this.skinName = skinName;
        this.iconURL = iconURL;
    }
}

// Main function
async function main() {
    try {
        console.log("Starting...".green);
        const lockfileData = await getLockfile();
        const port = lockfileData[2];
        const password = lockfileData[3];
        console.log("Getting store sales...".cyan);
        const api = createApi(port, password);
        // Function to get store sales
        async function getStoreSales() {
            const response = await api.get("/lol-store/v1/catalog/sales");
            return response.data;
        }
        // Get store sales
        const sales = await getStoreSales();
        // Create skins array
        let skins= [];
        // Get start and end date
        let startDate = sales[0].sale.startDate;
        let endDate = sales[0].sale.endDate;
        // Get skins info
        for (let i = 0; i < sales.length; i++) {
            // If the skin is not on sale, skip it
            if (sales[i].item.inventoryType != "CHAMPION_SKIN") continue;
            // If the skin is not in RP, skip it (Emporium chromas fix)
            if (sales[i].sale.prices[0].currency != "RP") continue;
            // Get skin info
            let skinId = sales[i].item.itemId;
            let champInfo = await getInfoSkins(skinId);
            let champId = champInfo[0];
            let originalPrice = champInfo[1];
            let discountPrice = champInfo[2];
            let discountPercent = champInfo[3];
            let skinName = champInfo[4];
            // Create skin object
            let skin = new Skin(startDate, endDate, skinId, champId, originalPrice, discountPrice, discountPercent, skinName, `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${champId}/${skinId}.jpg`);
            // Push skin to skins array
            skins.push(skin);
        }
        console.log("Creating image...".yellow);
        // Create image
        let image = await canvas(skins);
        // Save image
        console.log("Saving image...".cyan);
        fs.writeFileSync("storeSales.png", image);
        console.log("Image saved successfully.".green);
        console.log("Finished.".green);

    } catch (error) {
        console.error(`Error: ${error.message}`.red);
    }
}

main();