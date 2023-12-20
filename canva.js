const { createCanvas, loadImage, registerFont } = require('canvas')
const canvas = createCanvas(1370, 1195);
const path = require('path');
const ctx = canvas.getContext('2d');
const fontPath = path.join(__dirname, './assets/fonts/Spiegel-OTF/Spiegel-Bold.otf');
const fontPath2 = path.join(__dirname, './assets/fonts/BeaufortForLoL-TTF/BeaufortforLOL-Bold.ttf');

registerFont(fontPath, { family: 'Spiegel'});
registerFont(fontPath2, { family: 'BeaufortforLOL'});
module.exports = async function createImage(skins) {
    // Background
    let background = await loadImage('./assets/background/background.png');
    ctx.drawImage(background, 0, 0, canvas.width + 300, canvas.height);
    // Logo
    ctx.shadowColor = "#C89B3C";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "#C89B3C";
    ctx.font = "100px BeaufortforLOL";
    ctx.textAlign = "center";
    ctx.fillText("SHOP OFFERS", 1370 / 2, 100);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#E5DCCA";
    ctx.font = "30px Spiegel";
    let startDate = skins[0].startDate;
    let endDate = skins[0].endDate;
    // Get date from timestamp
    let date = new Date(startDate);
    let date2 = new Date(endDate);
    ctx.fillText(`${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getDate()}  -  ${date2.toLocaleString('default', { month: 'short' }).toLocaleUpperCase()} ${date2.getDate()} `, 1370 / 2, 150);
    
    for (let i = 0; i < skins.length; i++) {
        let rows_n = Math.floor(i / 5);
        let cols_n = i % 5;
        let x = 0 + (cols_n * 250);
        let y = 170 + (rows_n * 250);
        // Space between skins (x, y)
        x += cols_n * 20;
        y += rows_n * 20;

        // Skin info
        let skin = skins[i].skinName;
        let price = skins[i].discountPrice;
        let discountPercent = Math.round(skins[i].discountPercent * 100);
        let iconURL = skins[i].iconURL;
        
       
        // Skin image
        let img = await loadImage(iconURL);
        ctx.drawImage(img, x + 20 , y + 20, 250, 250);
        ctx.globalAlpha = 0.8;
        let gradient = ctx.createLinearGradient(x + 20, y + 20, x + 20, y + 270);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 20, y + 20, 250, 250);
        ctx.globalAlpha = 1;
       
        // Skin name background
        ctx.strokeStyle = "#3C3C41";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 20, y + 20, 250, 250);
        // Skin name text
        const lineWidthLimit = 25;
        let words = skin.split(' ');
        let lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            if (currentLine.length + word.length < lineWidthLimit) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine !== '') {
            lines.push(currentLine);
        }
        
        let lineHeight = 15;
        for (let i = 0; i < lines.length; i++) {
            if (lines.length == 1) {
                ctx.shadowColor = "black";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = "#E5DCCA";
                ctx.font = "17px Spiegel";
                ctx.fillText(lines[i], x + 145, y + 245 + i * lineHeight);
                ctx.shadowColor = "#E5DCCA";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                break;
            } else {
            ctx.shadowColor = "black";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillStyle = "#E5DCCA";
            ctx.font = "17px Spiegel";
            ctx.fillText(lines[i], x + 145, y + 230 + i * lineHeight);
            ctx.shadowColor = "#E5DCCA";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            }
        }
        // Price image
        let icon = await loadImage('./assets/props/lcu-rp.png');
        if (String(price).length > 3) {
            ctx.drawImage(icon, x + 112, y + 237 + lineHeight);
        } else {
            ctx.drawImage(icon, x + 115, y + 237 + lineHeight);
        }
        // Price text
        ctx.shadowColor = "black";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = "#C89B3C";
        ctx.font = "17px Spiegel";
        ctx.fillText(price, x + 150, y + 250 + lineHeight);
        ctx.shadowColor = "#E5DCCA";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        
        // Discount image
        let imageDiscount = await loadImage('./assets/props/lcu-sale.png');
        ctx.drawImage(imageDiscount, x + 22, y + 20, 50, 50);
        // Discount text
        ctx.shadowColor = "black";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = "white";
        ctx.font = "15px Spiegel";
        ctx.fillText(`-${discountPercent}%`, x + 48, y + 50);
        ctx.shadowColor = "#E5DCCA";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    // Footer
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "#C89B3C";
    ctx.font = "35px BeaufortforLOL";
    ctx.fillText("GENERATED BY RUSHWTF", 1370 / 2, 1195 - 20);
    ctx.shadowColor = "#E5DCCA";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    

    return canvas.toBuffer();

}