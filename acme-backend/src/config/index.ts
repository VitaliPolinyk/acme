export default {
    name: process.env.APP_NAME,
    port: process.env.PORT || 5000,
    logLevel: process.env.LOG_LEVEL || 'info',
    auth: {
        saltFactor: 10,
        secret: process.env.AUTH_SECRET,
        expiresIn: process.env.AUTH_EXPIRES_IN
    }
};