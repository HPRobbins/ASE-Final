Rewrite of main.js
- The guideline for the integration of MongoDB calls directly with the Express routes comes from code_11, 16_mongodb_express from in sample code.
- The guideline for using ejs(embedded javascript) files for the webpages comes from a chain fo sources I found by googling 'express calling dynamic html pages'
    - this stackoverflow: https://stackoverflow.com/questions/35633855/how-do-i-serve-partially-dynamic-html-pages-with-express led met to
    - this guide about using ejs in express routes with examples of how to pass data: https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
    - further details taken from https://www.npmjs.com/package/ejs

Direct MongoDB-Express Integration
    + Streamlines code
    + easier to follow (shorter paths)
    + MongoDB client is called by main.js, has a singular connection to DB instead of constantly opening and closing connections
    + Less annoying calls
EJS (Embedded Javascript)
    + HTML pages with javascript in them.
    + MongoDB-Express integration allows use to directly pass the data we need and cuts down on javascript on the webpage itself.
    + Can be used with both static and dynamic pages and enables us to more easily integrate partial pages (header, head, and footer examples)

Current Data Flow
mongoDB -> main.js -> page.ejs
1) main.js is called by the server and establishes connection with mongoDB
2) main.js sends mongoDB queries as requested depending on location in the routes.
3) main.js sends data to ejs page data in similiar fashion to the template from code_10, 5_request_object example from class.
    - the format of sending the data to replace it on ejs is different than the template from the example code but same concept.
4) ejs page runs internal javascript to display page & data.
5) ejs page sends api calls to main.js
