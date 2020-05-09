require("dotenv").config()
const path = require("path")

module.exports = {
  webpack(config, options) {
    config.resolve.alias["c"] = path.join(__dirname, "components")
    return config
  },
  env: {
    ENDPOINT:
      process.env.NODE_ENV === "production"
        ? process.env.ENDPOINT
        : "http://localhost:50001/",
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URL: process.env.REDIRECT_URL,
    AUTH_URL: process.env.AUTH_URL,
  },
}
