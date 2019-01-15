const creds = require('../../skai-config')
const mongoUname = creds.username
const mongoPword = creds.password

module.exports = {
  siteMetadata: {
    title: `skAIscraper™`,
    description: `Evolve beyond.`,
    author: `Oli and Joss`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // Gatsby's data processing layer begins with “source” plugins. Here we
    // setup the site to pull data from the "documents" collection in a local
    // MongoDB instance
    {
      resolve: `gatsby-source-mongodb`,
      options: {
        dbName: `testing`,
        collection: [`scrapes`, `articles`],
        //map: { articles: { /* WHAT DO I DO HERE? */ } },
        server: { address: 'cluster0-shard-00-01-ywxua.mongodb.net', port: 27017},
        auth: { user: mongoUname, password: mongoPword },
        extraParams: { replicaSet: 'Cluster0-shard-0', ssl: true, authSource: `admin`, retryWrites: true }
      }      
    },
    {
      resolve: `@wapps/gatsby-plugin-material-ui`,
      options: {
        theme: {
          primaryColor: 'dodgerblue'
        }
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
