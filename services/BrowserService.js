require("dotenv").config();
const puppeteer = require("puppeteer");

class BrowserService {
    static getBrowser() {
        return puppeteer.launch({
            headless: true,
            devtools: true,
        });
    }

    static closeBrowser(browser) {
        if (!browser) {
            return;
        }
        return browser.close();
    }
}

module.exports = BrowserService;
