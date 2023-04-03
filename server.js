require("dotenv").config();
require("express-async-errors");
const express = require("express");
const { errors } = require("celebrate");

const router = require("./src/router/router.js");
const Exception = require("./src/error/Exception.js");

const app = express();
app.use(express.json());

app.use("/", router);

app.use(errors());

app.use((err, req, res) => {
    if (err instanceof Exception) {
        console.log(err);
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

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
