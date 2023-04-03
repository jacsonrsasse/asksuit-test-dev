require("dotenv").config();
var moment = require("moment");
moment.locale("pt-br");
const puppeteer = require("puppeteer");
const Exception = require("../error/Exception");

class BrowserService {
    static getBrowser() {
        return puppeteer.launch();
    }

    static closeBrowser(browser) {
        if (!browser) {
            return;
        }
        return browser.close();
    }

    async getResult(req) {
        const url = BrowserService.createRequestUrl(req);

        const browser = await BrowserService.getBrowser();
        const page = await browser.newPage();
        await page.goto(url);

        try {
            await page.waitForSelector("#tblAcomodacoes");

            const results = await page.evaluate(() => {
                const nodeList = document.querySelectorAll(".row-quarto");
                const rooms = [...nodeList];
                const results = rooms.map((room) => {
                    const roomInfo = room.querySelector(".tdQuarto");
                    const roomDetails = room.querySelector(".tdContainer");

                    return {
                        name: roomInfo.querySelector(".quartoNome").innerText,
                        description:
                            roomInfo.querySelector(".quartoDescricao")
                                .innerText,
                        price: roomDetails
                            .querySelector(".precoQuarto")
                            .querySelector(".valorFinal").innerText,
                        image:
                            roomInfo.querySelector("img").src ||
                            roomInfo
                                .querySelector("img")
                                .getAttribute("data-src"),
                    };
                });

                return results;
            });

            await BrowserService.closeBrowser(browser);

            return results;
        } catch (error) {
            throw new Exception(
                "It looks like your request is taking too long to return. Please, try again.",
                408
            );
        }
    }

    static createRequestUrl(req) {
        if (!process.env.URL_WEB_CRAWLING) {
            throw new Exception(
                "Não foi definido o endereço de busca dos dados",
                500
            );
        }

        const body = req.body;
        const checkin = moment(body.checkin, "YYYY-MM-DD").format("L");
        const checkout = moment(body.checkout, "YYYY-MM-DD").format("L");

        const url = new URL(process.env.URL_WEB_CRAWLING);
        url.searchParams.set("checkin", checkin);
        url.searchParams.set("checkout", checkout);

        return url.toString();
    }
}

module.exports = BrowserService;
