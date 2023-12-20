const createApi = require("./createAPI");
const getLockfile = require("./lockfile");
const fs = require("fs");
async function getInfoSkins(skinId) {
    const lockfileData = await getLockfile();
    let port = lockfileData[2];
    let password = lockfileData[3];
    const api = createApi(port, password);
    const response = await api.get(`/lol-store/v1/skins/${skinId}`);
    let language = JSON.parse(fs.readFileSync("./cache/data.json", "utf-8")).language;
    let data = [];
    let champId = response.data.itemRequirements[0].itemId
    let originalPrice = response.data.prices[0].cost;
    let discountPrice = response.data.sale.prices[0].cost;
    let discountPercent = response.data.sale.prices[0].discount;
    let skinName = response.data.localizations[language].name;
    console.log(`Getting info from ${skinName}`.cyan);
    data.push(champId, originalPrice, discountPrice, discountPercent, skinName);
    console.log(`Info from ${skinName} got successfully`.green);
    return data;
}

module.exports = getInfoSkins;