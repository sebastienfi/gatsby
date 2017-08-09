module.exports = {
  siteMetadata: {
    title: 'A sample site using gatsby-source-wordpress',
    subtitle: 'Data fetched from a site hosted on wordpress.com'
  },
  plugins: [
    /*
     * Gatsby's data processing layer begins with “source”
     * plugins. Here the site sources its data from Wordpress.
     */
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        /*
        * The base URL of the Wordpress site without the trailingslash and the protocol. This is required.
        * Example : 'gatsbyjsexamplewordpress.wordpress.com' or 'www.example-site.com'
        */
        baseUrl: 'gatsbyjsexamplewordpress.wordpress.com',
        // The protocol. This can be http or https.
        protocol: 'http',
        // Indicates whether the site is hosted on wordpress.com.
        // The plugin will then source its content on wordpress.com using the JSON REST API V2.
        // If your site is hosted on wordpress.org, then set this to false.
        hostingWPCOM: true,
        // If useACF is true, then the source plugin will try to import the Wordpress ACF Plugin contents.
        // This feature is untested for sites hosted on Wordpress.com. Please PR if your test is successfull !
        useACF: false,
        // If auth.user and auth.pass are filled, then the source plugin will be allowed to access endpoints that are protected with .htaccess.
        auth: {
          user: 'your-htaccess-username',
          pass: 'your-htaccess-password',
          sendImmediately: false,
        },
        // Set verboseOutput to true to display a verbose output on `npm run develop` or `npm run build`
        // It can help you debug specific API Endpoints problems
        verboseOutput: false,
        // Download a local copy of the assets. Best used with the Gatsby Sharp plugin.
        // Require gatsby-source-filesystem
        localAssets: true,
      },
    },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `images`,
    //     path: `${__dirname}/public/static/images`,
    //   },
    // },
    // This plugin identifies file nodes that are images and
    // transforms these to create new “ImageSharp” nodes.
    // With them you can resize images and
    // generate responsive image thumbnails.
    `gatsby-transformer-sharp`,
    // This plugin exposes helper functions for processing
    // images with the NPM package “sharp”. It's used by
    // several other plugins.
    `gatsby-plugin-sharp`,

  ],
}
