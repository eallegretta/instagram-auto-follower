const puppeteer = require("puppeteer");
const config = require("./config");
const delay = require("./delay");

class Parser {

    constructor(){
        this.page = null;
    }

    async init(){
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport:{
                width:1600,
                height:1200
            },
            args: ["--window-size=1600,1200"]
        });

        this.page = await browser.newPage();
    }

    async login(){
        await this.page.goto("https://www.instagram.com");

        const loginButton = await this.page.waitForXPath("//a[contains(text(), 'Log in')]");
    
        await loginButton.click();
    
        await delay(1500);
    
        const usernameInput = await this.page.waitForSelector('input[name="username"]');
        await usernameInput.type(config.login.username);
    
        const passwordInput = await this.page.$('input[type="password"]');
        await passwordInput.type(config.login.password);
    
        const loginSubmitButton = await this.page.$('button[type="submit"]');
        await loginSubmitButton.click();
    
        try
        {
            const notNowButton = await this.page.waitForXPath("//button[contains(text(), 'Not Now')]", {
                timeout: 5000
            });
    
            await notNowButton.click();
        }
        catch{
    
        }
    }

    async beginFollow(hashtag){
        await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);

        const articleImages = await this.page.waitForSelector("article");
    
        const urls = await this.page.$$eval("article a", (anchors) => anchors.map(anchor => anchor.href));
    
        for(let index = 0; index < urls.length || index < 10; index++){
            let url = urls[index];
    
            await this.page.goto(url);
    
            await this.page.waitForSelector("article");
    
            let followingButton = await this.page.$x("//button[contains(text(), 'Following')]");
    
            if(followingButton.length > 0) continue;
    
            let followButton = await this.page.$x("//button[contains(text(), 'Follow')]");
    
            await followButton[0].click();
    
            await delay(1500);
    
            let followedUsername = (await this.page.$$eval("article header h2", elems => elems.map(x => x.textContent)))[0];
    
            console.log(`We have just followed ${followedUsername}`);
        }
    }
}

exports.parser = new Parser();