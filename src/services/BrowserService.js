require("dotenv").config();
var moment = require("moment");
moment.locale("pt-br");
const puppeteer = require("puppeteer");
const Exception = require("../error/Exception");

class BrowserService {
    static url =
        "https://pratagy.letsbook.com.br/D/Reserva?checkin={checkin_value}&checkout={checkout_value}&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=3%2F14%2F2023";

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
        const body = req.body;
        const checkin = moment(body.checkin, "YYYY-MM-DD").format("L");
        const checkout = moment(body.checkout, "YYYY-MM-DD").format("L");

        const url = (process.env.URL_WEB_CRAWLING ?? BrowserService.url)
            .replace("{checkin_value}", checkin)
            .replace("{checkout_value}", checkout);

        return url;
    }
}

module.exports = BrowserService;
