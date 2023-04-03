require("dotenv").config();
const express = require("express");
require("express-async-errors");
const { errors } = require("celebrate");

const router = require("./src/router/router.js");
const Exception = require("./src/error/Exception.js");

const app = express();
app.use(express.json());

app.use("/", router);

app.use(errors());

app.use(async (err, req, res, next) => {
    if (err instanceof Exception) {
        return res.status(err.statusCode).json({
            status: "Error",
            message: err.message,
        });
    }

    // Erro padrão
    return res.status(500).json({
        status: "Error",
        message: `Internal Server Error: ${err.message}`,
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
