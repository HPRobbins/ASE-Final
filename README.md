# ASE-Final

Things to pin down:
 = How we handle the data from MangoDB
    = Specifically what do our APIs look like? What are they returning? What do we send to them? (Do they return everything out of the database and let the server side code chop it up into appropriate (based on authentication, user-pet relationship, etc) bits or do they return only what was asked for?)
    - example rough draft: DELETE api - receives ID of target and which collection its in as parameters of the request, returns the response of status of the deletion (success, 404 file not found, connection error, etc)
   = How does incorporating authentication work?
 = Express.js - getting the modules necesscary. How do we split up the different paths? (Ex: Pepper handles /users/:user/pets/:pet pages and /users/:user/pets/ pages)
 

DATA APIS
GET - Recieves the target collection, outputs all the data in the specific collection (filtration handled on programming side) and status response.
POST - Recieves the target collection and the data to be inserted as a JSON, outputs the status response of the insertion.
PUT - Receives the target collection and data on the page (full rewrite of old data) and the ID of the data to be updated, outputs a status response.
DELETE - Recieves the target collection and the ID of the data to be updated, outputs a status response.

