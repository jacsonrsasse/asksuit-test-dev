class Exception {
    message;
    statusCode;

    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode || 500;
    }
}

module.exports = Exception;
