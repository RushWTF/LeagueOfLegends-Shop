const axios = require('axios');
const https = require('https');
const fs = require('fs');
const canvas = require('./canva');

// Get lockfile data
async function getLockfile() {
    const lockfile = fs.readFileSync("C:\\Riot Games\\League of Legends\\lockfile", "utf8");
    return lockfile.split(":");
}
// Create API
function createApi(port, password) {
    const agent = new https.Agent({  
        rejectUnauthorized: false,
    });

    return axios.create({
        baseURL: `https://127.0.0.1:${port}`,
        headers: {
            Authorization: `Basic ${Buffer.from(`riot:${password}`).toString("base64")}`,
        },
        httpsAgent: agent,
    });
}
// Main function
async function main() {
    try {
        const lockfileData = await getLockfile();
        const port = lockfileData[2];
        const password = lockfileData[3];
        const api = createApi(port, password);
        async function getStoreSales() {
            const response = await api.get("/lol-store/v1/catalog/sales");
            return response.data;
        }
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
        // Get skin info
        async function getInfoSkins(skinId) {
            const response = await api.get(`/lol-store/v1/skins/${skinId}`);
            let data = [];
            let champId = response.data.itemRequirements[0].itemId
            let originalPrice = response.data.prices[0].cost;
            let discountPrice = response.data.sale.prices[0].cost;
            let discountPercent = response.data.sale.prices[0].discount;
            let skinName = response.data.localizations.es_ES.name;
            data.push(champId, originalPrice, discountPrice, discountPercent, skinName);
            return data;
        }
        // Get store sales
        const sales = await getStoreSales();
        let skins= [];
        // Get start and end date
        let startDate = sales[0].sale.startDate;
        let endDate = sales[0].sale.endDate;
        for (let i = 0; i < sales.length; i++) {
            // If the skin is not on sale, skip it
            if (sales[i].item.inventoryType != "CHAMPION_SKIN") continue;
            // If the skin is not in RP, skip it (Emporium chromas fix)
            if (sales[i].sale.prices[0].currency != "RP") continue;
            let skinId = sales[i].item.itemId;
            let champInfo = await getInfoSkins(skinId);
            let champId = champInfo[0];
            let originalPrice = champInfo[1];
            let discountPrice = champInfo[2];
            let discountPercent = champInfo[3];
            let skinName = champInfo[4];
            let skin = new Skin(startDate, endDate, skinId, champId, originalPrice, discountPrice, discountPercent, skinName, `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${champId}/${skinId}.jpg`);
            skins.push(skin);
        }
        // Create image
        let image = await canvas(skins);
        // Save image
        fs.writeFileSync("storeSales.png", image);

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();