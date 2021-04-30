require("chromedriver");

const wd = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const browser = new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
let matchId = process.argv[2];
let innings = process.argv[3];
let batsmanScorecard = [];
let bowlerScorecard = [];
let batsmanKeys = ["playerName", "out", "runs", "ballsPlayed", "fours", "sixes", "strikeRate"];
let bowlerKeys = ["bowlerName", "overs", "maidenOvers", "runsGiven", "wickets", "noBalls", "wideBalls", "economy"];
async function main(){
    await browser.get("https://www.cricbuzz.com/live-cricket-scores/" + matchId);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr")));
    let tables = await browser.findElements(wd.By.css("#innings_" + innings + " .cb-col.cb-col-100.cb-ltst-wgt-hdr"));
    let innings1BatsmenRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < innings1BatsmenRows.length; i++){
        let columns = await innings1BatsmenRows[i].findElements(wd.By.css("div"));
        let data = {};
        if(columns.length == 7){
            for(let j = 0; j < columns.length; j++){
                data[batsmanKeys[j]] = await columns[j].getAttribute("innerText");
            }
            batsmanScorecard.push(data);
        }
    }
    console.log(batsmanScorecard);

    let innings1BowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < innings1BowlerRows.length; i++){
        let columns = await innings1BowlerRows[i].findElements(wd.By.css("div"));
        let data = {};
        if(columns.length == 8){
            for(let j = 0; j < columns.length; j++){
                data[bowlerKeys[j]] = await columns[j].getAttribute("innerText");
            }
            bowlerScorecard.push(data);
        }
    }
    console.log(bowlerScorecard);
    
    await browser.close();
}

main();