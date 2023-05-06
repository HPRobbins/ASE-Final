const express = require('express')
const { join } = require('path')
const app = express()
const path = require('path');
const fs = require('fs')
const axios = require('axios');

const port = 5500
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser');

app.set('view engine', 'ejs')
app.use(bodyParser.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://appclient:LbSgYnUaMQ8jTACg@pet-website-project.ksy84iw.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
ObjectID = require('mongodb').ObjectID
var db=null


/* Middleware */
app.use(express.static('views'))
app.use(bodyParser.json())
app.use(cookieParser())

// our connect function.
async function connect(){
	let connection=await client.connect()
	return connection
}

// TODO: equivalents to PUT and DELETE, alter and remove

// PUSHes data to mongoDB
async function insert(db,database,collection,document){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).insertOne(document)
    // console.log(result)
    return result;
  }
  
  // GETS data from mongoDB
  async function find(db,database,collection,criteria){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).find(criteria).toArray()
    return result;
  }

  // PUT data
  async function update(db,database, collection, documentID, document){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).replaceOne({_id:documentID},document)
    
    return result;
  }

// for default page, should take user to welcomePage
app.route('/')
    // fetching the basic page. return welcomePage.html
	.get(async function(req, res){
        res.render('pages/welcomePage')
	})
    // maybe for authentication?
	.post((req, res) => {
	  res.send('Got a POST request')
	})
    // maybe for authentication?
	.put((req, res) => {
	  res.send('Got a PUT request')
	})
	.patch((req, res) => {
	  res.send('Got a PATCH request')
	})
    // unneeded, can be removed/ignored
	.delete((req, res) => {
	  res.send('Got a DELETE request')
	})

app.route('/signUp')
    // return the signUp.html
	.get(async function(req, res) {
	  // displays intial signUp page.
      // console.log(req);
      res.render('pages/signUp')
	})
    // yes! Creating new user in database
	.post((req, res) => {
	  res.send('Got a POST request')
	})
	.put((req, res) => {
	  res.send('Got a PUT request')
	})
	.patch((req, res) => {
	  res.send('Got a PATCH request')
	})
    // unneeded, can be removed/ignored
	.delete((req, res) => {
	  res.send('Got a DELETE request')
	})

    // If we are keeping index.html, keep this.
app.route('/users/')
    // would return index.html and the list of users
	.get(async function(req, res){
        // everything in the Users collection is put into an array called result
      let result=await find(db,'Pet-Website-Project','Users',{})
      
      if(result.length==0)
      {
        res.send("404: No users found in database.")
      }
      else{
        // rewrites result array to create userID field and add _id as a string.
         result.forEach(user => {
             user['userID'] = user._id.toString();
         })
 
         // passes the array to the index page to replace instances of 'users'
       res.render('pages/index',{
         users:result
       });

      }
	})
    // possibly unneeded, can be ignored/removed.
	.post((req, res) => {
	  res.send('Got a POST request')
	})
	.put((req, res) => {
	  res.send('Got a PUT request')
	})
	.patch((req, res) => {
	  res.send('Got a PATCH request')
	})
    // maybe an admin only feature?
	.delete((req, res) => {
	  res.send('Got a DELETE request')
	})
    
    // calls the userDetail page
app.route('/userDetail/:userID')
    // get details of user & the userDetail page
    // also returns all pets owned by user.
    .get(async function(req, res){
        // res.send('Got a GET request')
        let ownerID = req.params.userID

        // convert userID as string into ObjectID for search in MongoDB
        let mdbUserID = new ObjectId(ownerID);
        // returns the single user as part of an array
        let user=await find(db,'Pet-Website-Project','Users',{_id:mdbUserID})
        // check that the user exists
        if(user.length==0)
        {
            res.send("404: Target not found.")
        }
        else{
            // pull the user out of the array.
            user=user[0];
            // readd the string version ofthe _id
            user.userID = ownerID

            let pets=await find(db,'Pet-Website-Project','Pets',{userID:ownerID})

            // convert _ID to a string & add to animal array
            pets.forEach(pet => {
                pet['petID'] = pet._id.toString();
            })

            // send variables to the page to be used.
            res.render('pages/userDetail',{
                user:user,
                pets:pets
            });
        }
    })
    // maybe for adding new animals?
    // calls addPet.html if so.
    .post((req, res) => {
        res.send('Got a POST request')
    })
    // no updates on this page as currently designed.
    // can be removed/ignored
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    .delete((req, res) => {
        res.send('Got a DELETE request from /users/:userID')
        // check that the user has no pets associated with them, if they do, deny the request or delete the pets too.
        // run a find for any pets with the user's ID set o a variable.
        // if els statement: if pets of user exist, send "cannot delete user that has pets", else delete user.
    })

     // calls the userEdit page for a specific user
app.route('/user/edit/:userID')
    // get details of user & the userEdit page
    .get(async function(req, res){
        let ownerID = req.params.userID
        // convert userID as string into ObjectID for search in MongoDB
        let mdbUserID = new ObjectId(ownerID);
        // returns the single user as part of an array
        let user=await find(db,'Pet-Website-Project','Users',{_id:mdbUserID})
        // pull the user out of the array.
        user=user[0];
        user.userID = ownerID


        // send variables to the page to be used.
        res.render('pages/userEdit',{
            user:user
       });
    })
    .post(async (req, res) => {
        // using post becaue PUT doesn't work for the form.
        res.send('Got a POST request in user/edit/:userID')
        console.log(req.body.emailAddress)
        let ownerID = req.params.userID
        let mdbUserID = new ObjectId(ownerID);

        console.log(req.body)

        var newValues=req.body
        
         let result=await update(db,'Pet-Website-Project','Users',mdbUserID,newValues,function(err,result){
            if (err) throw err
            console.log(err)
         })

         res.render()



    })
    .put(async function(req, res){
        let ownerID = req.params.userID
        let mdbUserID = new ObjectId(ownerID);
        
        console.log("in user/edit put")
        console.log(res.body);
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    // unneeded, remove/ignore
    .delete((req, res) => {
        res.send('Got a DELETE request')
    })


    // detail page for a specific pet
app.route('/petDetail/:petID')
    // returns petDetail with information of the specific pet and any medicines its on.
    .get(async function(req, res){
        // res.send('Got a GET request')
        let animalID = req.params.petID
        let mdbPetID = new ObjectId(animalID)

        let pet=await find(db,'Pet-Website-Project','Pets',{_id:mdbPetID})
        // pull the user out of the array.
        pet=pet[0];
        // readd the string version ofthe _id
        pet.petID = animalID

        let date = pet.petDoB
        pet.petDoB = date.toDateString()

        let meds=await find(db,'Pet-Website-Project','MedLog',{petID:mdbPetID})

        // convert _ID to a string & add to animal array
        meds.forEach(med => {
            meds['medID'] = meds._id.toString();
        })

        // should petDetail be turned into a template? How do we integrate databse pull with that?
        res.render('pages/petDetail',{
            pet:pet,
            meds:meds
       });
    })
    // unneeded, remove/ignore
    .post((req, res) => {
        res.send('Got a POST request')
    })
    // we use petEdit for updates to pet, but might need for adding a new medication
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    .delete((req, res) => {
        res.send('Got a DELETE request')
    })

    // edit page for specific pet
    // TODO: create ejs, run the strings.
app.route('/:petID/edit')
    // calls the petEdit page for the specific pet.
    .get((req, res) =>{
        res.send('Got a GET request')
    })
    // unneeded, remove/ignore
    .post((req, res) => {
        res.send('Got a POST request')
    })
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    // unneeded, remove/ignore
    .delete((req, res) => {
        res.send('Got a DELETE request')
    })


    //add a pet
    app.route('/userDetail/addPet/:userID')
    .get(async function(req, res){
        let ownerID = req.params.userID
        let mdbUserID = new ObjectId(ownerID)
        let user=await find(db,'Pet-Website-Project','Users',{_id:mdbUserID})
        // pull the user out of the array.
        user=user[0];
        user.userID = ownerID
        console.log('in add pet get')

        // send variables to the page to be used.
        res.render('pages/addPet',{
            user:user
        });

    })
    .post(async (req, res) => {
        res.send('Got a POST request in add pet')
        console.log(req.body)
        let ownerID = req.params.userID

        var information=req.body
        
         let result=await insert(db,'Pet-Website-Project','Pets',information,function(err,result){
            if (err) throw err
            console.log(err)
         })

         console.log()
    })


    // detail page of a medicine
app.route('/users/:userID/pets/:petID/medlog/:medID')
    // call the medDetail page and fills in the information.
    .get(async function(req, res){
        let medicineID = req.params.medID
        let mdbMedID = new ObjectId(medicineID)

        let med=await find(db,'Pet-Website-Project','MedLog',{_id:mdbMedID})

        med=med[0];
        med.medID = medicineID;

        let meds=await find(db,'Pet-Website-Project','Pets',{petID:mdbMedID})

        meds.forEach(individualMed => {
            individualMed['medID'] = med._id.toString();
        })
        
        res.render('pages/medDetail',{
            med:med,
            individualMed:individualMed
          });
    })
    .post((req, res) => {
        res.send('Got a POST request')
    })
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    .delete((req, res) => {
        res.send('Got a DELETE request')
    })

app.route('/:medID/edit')
    // call the medDetail page and fills in the information.
    .get((req, res) =>{
        res.send('Got a GET request')
    })
    .post((req, res) => {
        res.send('Got a POST request')
    })
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    .delete((req, res) => {
        res.send('Got a DELETE request')
    })

// actually starts the connection and waits for connection.
 async function start(){
    db=await connect()
    console.log('mongoDB connected')
    app.listen(port,()=>{
      console.log(`Example app listening on port ${port}`)
    })
}

start()
    
