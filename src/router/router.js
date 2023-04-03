require("dotenv").config();
var moment = require("moment");
moment.locale("pt-br");
const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments, CelebrateError } = require("celebrate");
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
                    moment(NewJoi.ref("checkin")).add(
                        parseInt(process.env.MINIMUN_NIGHTS_STAY ?? 3),
                        "days"
                    )
                ),
        },
    }),
    controller.search
);

module.exports = router;
