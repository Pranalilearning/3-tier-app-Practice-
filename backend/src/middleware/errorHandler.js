const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode >= 500 
        ? "Internal Server Error" 
        : (err.message || "Bad Request");

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;