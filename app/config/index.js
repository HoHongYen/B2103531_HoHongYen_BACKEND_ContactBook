const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb+srv://yenvt9a0:yen181103@cluster0.ppdhwld.mongodb.net/?retryWrites=true&w=majority"
    }
};

module.exports = config;