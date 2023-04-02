require("dotenv").config();
const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const BrowserService = require("../services/BrowserService");

const NewJoi = Joi.extend(require("@joi/date"));

router.get("/", (req, res) => {
    res.send("Hello Asksuite World!");
});

router.post(
    "/search",
    celebrate({
        [Segments.BODY]: {
            checkin: NewJoi.date().format("YYYY-MM-DD").required(),
            checkout: NewJoi.date().format("YYYY-MM-DD").required(),
        },
    }),
    async (req, res) => {
        const browser = await BrowserService.getBrowser();
        const page = await browser.newPage();
        await page.goto(process.env.URL_WEB_CRAWLING_TEST);

        // Esse await tem timeout... tratar esse erro você deve
        await page.waitForSelector("#tblAcomodacoes");
        const results = await page.evaluate(() => {
            const nodeList = document.querySelectorAll(".row-quarto");
            const rooms = [...nodeList];
            debugger;
            const results = rooms.map((room) => {
                debugger;
                let roomInfo = room.querySelector(".tdQuarto");
                let roomDetails = room.querySelector(".tdContainer");

                return {
                    name: roomInfo.querySelector(".quartoNome").innerText,
                    description:
                        roomInfo.querySelector(".quartoDescricao").innerText,
                    price: roomDetails
                        .querySelector(".precoQuarto")
                        .querySelector(".valorFinal").innerText,
                    image:
                        roomInfo.querySelector("img").src ||
                        roomInfo.querySelector("img").getAttribute("data-src"),
                };
            });

            return results;
        });

        await BrowserService.closeBrowser(browser);

        res.status(200).json(results);
    }
);

//TODO implement endpoint here

module.exports = router;
