const fs = require('fs');
const prompt = require('prompt');
const colors = require('colors');
// Get lockfile data
async function getLockfile() {
    var lockfile;
    // If data.json doesn't exist, create it
    if (!fs.existsSync("./cache/data.json")) {
        console.log("Lockfile path not found, please enter it manually.".red);
        prompt.start();
        var resultLockfile = await prompt.get(["lockfile"]);
        console.log("Lockfile path entered successfully.".green);
        console.log("Saving lockfile path...".cyan);
        console.log("If you want to change the lockfile path, delete the data.json file.".green)
        lockfile = fs.readFileSync(resultLockfile.lockfile, "utf-8");
        console.log("Enter your language (es_ES, en_US, etc...)".yellow);
        prompt.start();
        var resultLang = await prompt.get(["language"]);
        console.log("Language entered successfully.".green);
        console.log("Saving language...".cyan);
        fs.writeFileSync("./cache/data.json", JSON.stringify({lockfile: resultLockfile.lockfile, language: resultLang.language}));
    }
    else {
        var lockfileRead = fs.readFileSync("./cache/data.json", "utf-8");
        lockfileRead = JSON.parse(lockfileRead).lockfile;
        lockfile = fs.readFileSync(lockfileRead, "utf-8");
    }
    return lockfile.split(":");
}

module.exports = getLockfile;