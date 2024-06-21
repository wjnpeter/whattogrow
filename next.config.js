require('dotenv').config()

module.exports = {
  webpack: (config, options) => {
    config.node = { fs: 'empty' };

    return config
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,

    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    DARKSKY_API_KEY: process.env.DARKSKY_API_KEY,

    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PSW: process.env.DATABASE_PSW,

    LIKE_LS_KEY: process.env.LIKE_LS_KEY,
    SEARCH_LS_KEY: process.env.SEARCH_LS_KEY,

    LOGIN_KEY: process.env.LOGIN_KEY,
  },
}
