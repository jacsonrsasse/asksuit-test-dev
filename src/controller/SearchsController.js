require("dotenv").config();
const Exception = require("../error/Exception");
const BrowserService = require("../services/BrowserService");
var moment = require("moment");
moment.locale("pt-br");

class SearchsController {
    search = async (req, res) => {
        const service = new BrowserService();
        const result = await service.getResult(req);
        return res.status(200).json(result);
    };
}

module.exports = SearchsController;
