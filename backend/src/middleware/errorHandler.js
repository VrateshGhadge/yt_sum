//NODE_ENV - just for showing the errors when needed

const ErrorHandler = (err, req, res, next) => {
    console.log("Error Handling Middleware");

    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {} //condition ? value_if_true : value_if_false
    });
};

module.exports = ErrorHandler;

