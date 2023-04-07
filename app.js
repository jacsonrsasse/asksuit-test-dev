// Este pode ser passado para o config do require do dotenv, se assim for necessário...
const envConfig = {
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
};
require("dotenv").config();

const express = require("express");
require("express-async-errors");

class App {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
        this.afterRoutes();
    }

    middlewares() {
        this.express.use(express.json());

        const cors = require("cors");
        this.express.use(cors());
    }

    routes() {
        this.express.use("/", require("./src/router/router.js"));
    }

    afterRoutes() {
        const { errors } = require("celebrate");
        this.express.use(errors());

        const Exception = require("./src/error/Exception.js");
        this.express.use(async (err, req, res, next) => {
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
    }
}

module.exports = new App().express;
