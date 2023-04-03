require("dotenv").config();
var moment = require("moment");
moment.locale("pt-br");
const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const SearchsController = require("../controller/SearchsController");

const NewJoi = Joi.extend(require("@joi/date"));

const controller = new SearchsController();

router.get("/", (req, res) => {
    res.send("Hello Asksuite World!");
});

router.post(
    "/search",
    celebrate({
        [Segments.BODY]: {
            checkin: NewJoi.date().format("YYYY-MM-DD").required(),
            checkout: NewJoi.date()
                .format("YYYY-MM-DD")
                .required()
                .min(
                    NewJoi.ref("checkin", {
                        adjust: (value) =>
                            moment(value).add(
                                parseInt(process.env.MINIMUN_NIGHTS_STAY || 3),
                                "days"
                            ),
                    })
                )
                .messages({
                    "date.min": `{{#label}} must be ${parseInt(
                        process.env.MINIMUN_NIGHTS_STAY || 3
                    )} days greater than {{:#limit}}`,
                }),
        },
    }),
    controller.search
);

module.exports = router;
