# ASE-Final

Things to pin down:
 = How we handle the data from MangoDB
    = Specifically what do our APIs look like? What are they returning? What do we send to them? (Do they return everything out of the database and let the server side code chop it up into appropriate (based on authentication, user-pet relationship, etc) bits or do they return only what was asked for?)
    - example rough draft: DELETE api - receives ID of target and which collection its in as parameters of the request, returns the response of status of the deletion (success, 404 file not found, connection error, etc)
   = How does incorporating authentication work?
 = Express.js - getting the modules necesscary. How do we split up the different paths? (Ex: Pepper handles /users/:user/pets/:pet pages and /users/:user/pets/ pages)
 
