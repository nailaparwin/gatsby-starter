/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

// And then you can use the config in gatsby-config.js
const config = require('gatsby-plugin-config');

module.exports = {
  /* Your site config here */
  plugins: [],
}
