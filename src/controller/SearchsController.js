const BrowserService = require("../services/BrowserService");

class SearchsController {
    search = async (req, res) => {
        const service = new BrowserService();
        const result = await service.getResult(req);
        return res.status(200).json(result);
    };
}

module.exports = SearchsController;
