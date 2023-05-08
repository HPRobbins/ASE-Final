
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



Icon credits: Image by <a href="https://pixabay.com/users/mk_al-19145027/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6063639">Maks</a> from <a href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6063639">Pixabay</a>