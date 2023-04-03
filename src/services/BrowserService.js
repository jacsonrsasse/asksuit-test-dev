require("dotenv").config();
const puppeteer = require("puppeteer");

class BrowserService {
    static getBrowser() {
        const headless = process.env.PUP_HEADLESS
            ? process.env.PUP_HEADLESS === "false"
            : true;
        const devtools = process.env.PUP_DEVTOOLS
            ? process.env.PUP_DEVTOOLS === "true"
            : false;
        return puppeteer.launch({
            headless,
            devtools,
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
