require("dotenv").config();
const express = require("express");
const { errors } = require("celebrate");
const router = require("./routes/router.js");

const app = express();
app.use(express.json());

app.use("/", router);

app.use(errors());

const port = process.env.PORT;

app.listen(port || 8080, () => {
    console.log(`Listening on port ${port}`);
});
