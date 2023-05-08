<<<<<<< HEAD
Rewrite of main.js
Done as prototype to explore alternative way to address issues with complexity of integration found from trying to adapt previous website design. Using EJS came out of a necessity of being unable to find old class example that demonstrated a different method of calling building a webpage in pieces althought the header, head, and footer of EJS is done in similiar fashion/concept.
- The guideline for the integration of MongoDB calls directly with the Express routes comes from code_11, 16_mongodb_express from in sample code.
- The guideline for using ejs(embedded javascript) files for the webpages comes from a chain fo sources I found by googling 'express calling dynamic html pages'
    - this stackoverflow: https://stackoverflow.com/questions/35633855/how-do-i-serve-partially-dynamic-html-pages-with-express led met to
    - this guide about using ejs in express routes with examples of how to pass data: https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
         - Better explanation of ejs https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/
    - further details taken from https://www.npmjs.com/package/ejs
=======
>>>>>>> 6d92c74ece40a0d52f1533321250a130eb133bb2

Direct MongoDB-Express Integration
    + Streamlines code
    + easier to follow (shorter paths)
    + MongoDB client is called by main.js, has a singular connection to DB instead of constantly opening and closing connections
    + Less annoying calls
** If this were a full-scale public facing website with lots of data movement all the time, this probably would not work. we would need to offload the database calls to stand-alone blocks that could be run asynchronously from each other. **

EJS (Embedded Javascript)
    + Templating engine that looks like html.
    + MongoDB-Express integration allows use to directly pass the data we need and cuts down on javascript on the webpage itself.
    + Can be used with both static and dynamic pages and enables us to more easily integrate partial pages (header, head, and footer examples)

Current Data Flow
 mongodb <-> main.js <-> page.ejs
 
1) main.js is called by the server and establishes connection with mongoDB
2) main.js sends mongoDB queries as requested depending on location in the routes.
3) main.js sends data to ejs page data in similiar fashion to the template from code_10, 5_request_object example from class.
    - the format of sending the data to replace it on ejs is different than the template from the example code but same concept.
4) ejs page runs internal javascript to display page & data.
5) ejs page sends api calls to main.js

----------------------------------------------------------Pages----------------------------------------------------------
Landing page - Sign in:
        The main landing page is our Sign in page. Basic authentication where users can sign in or sign up. If a user is signing up, they are signed up as default: user. Upon clicking "Login", the user is taken to the index page.

Index page: 
        Shows a list of users, click details to see more about the user.

User detail page: 
        Shows basic user info, and a list of all of User's pets. Ability to add a user, edit a user, add a pet, and delete user if signed in. Click detail too see more information about their pets.

Pet detail page: 
        Shows info about pet and their medications. Ability to add a pet, edit a pet, add a medication, and delete pet if signed in. Click details on med car to see more info.

Medication detail page:
        Shows info about the Pet's mediation. Ability to edit medication, and delete medication if signed in.

----------------------------------------------------------Authentication----------------------------------------------------------
Authentication is handled with checks on both client-side and server side.
Server-side authentication consists of creating cookies that are a boolean that declare if the user is allowed to access the priviledges associated with that cookie.
        CookieEdit      - Is set to true if user looking at a page is the user who owns the information on the page, or has the admin role.
                        - Allows user to perform: edits to user being viewed, add a pet to the user being viewed, and delete the user being viewed.
        PetEditCookie   - Is set to true if user looking at a page is the user who owns the information on the page, or has the admin role.
                        - Allows user to perform: edits to the pet being viewed, add a medication to the pet, or delete the pet being viewed.
        MedEditCookie   - Is set to true if user looking at a page is the user who owns the information on the page, or has the admin role.
                        - Allows user to perform: edits to medication being viewed, or delete the pet being viewed.
Client-side authentication consists of disabling the associated link/button on the webpage to disabled. 
