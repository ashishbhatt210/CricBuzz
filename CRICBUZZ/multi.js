require("chromedriver");

const wd = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
let browser = new wd.Builder().forBrowser('chrome').build();
let matchId = process.argv[2];
let innings = process.argv[3];
let batsmanUrls = [];
let bowlerUrls = [];
let careerData = [];
let fs = require('fs');
let playersAdded = 0;

async function getData(url, i, totalplayers){
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(finalUrl[i]);
        let table = await browser.findElements(wd.By.css("table"));
        let battingKeys = [];
        let bowlingKeys = [];
        for(let j = 0; j < table.length; j++){
            let keycolumns = await table[j].findElements(wd.By.css("thead th"));
            for(let k = 1; k < keycolumns.length; k++){
                let title = await keycolumns[k].getAttribute("title");
                title = title.split(" ").join("");
                if(j == 0){
                    battingKeys.push(title);
                }
                else{
                    bowlingKeys.push(title);
                }
            }
            let data = {};
            let dataRows = await table[j].findElements(wd.By.css("tbody tr"));
            for(let k = 0; k < dataRows.length; k++){
                let tempData = {};
                let dataColumns = await dataRows[k].findElements(wd.By.css("td"));
                let matchType = await dataColumns[0].getAttribute("innerText");
                for(let l = 1; l < dataColumns.length; l++){
                    tempData[j == 0 ? battingKeys[l-1] : bowlingKeys[l-1]] = await dataColumns[l].getAttribute("innerText");
                }
                data[matchType] = tempData;
            }
            careerData[i][j == 0 ? "battingCareer" : "bowlingCareer"] = data;
        }
        playersAdded += 1;
        if(playersAdded == totalplayers){
            fs.writeFileSync("career.json", JSON.stringify(careerData));
        }
        await browser.close();
}

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
        if(columns.length == 7){
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute("innerText");
            careerData.push({"playerName" : playerName});
            batsmanUrls.push(url);
        }
    }

    let innings1BowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i = 0; i < innings1BowlerRows.length; i++){
        let columns = await innings1BowlerRows[i].findElements(wd.By.css("div"));
        if(columns.length == 8){
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute("innerText");
            careerData.push({"playerName" : playerName});
            bowlerUrls.push(url);
        }
    }
    finalUrl = batsmanUrls.concat(bowlerUrls);
    for(let i = 0; i < finalUrl.length; i++){
        getData(finalUrl[i], i, finalUrl.length);
    }
    await browser.close();
}
main();