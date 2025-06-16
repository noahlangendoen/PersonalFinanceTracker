module.exports = {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.CLIENT_URL 
            : 'http://localhost:3000',
        credentials: true
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d'
    }
};