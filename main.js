const express = require('express')
const { join } = require('path')
const app = express()
const path = require('path');
const fs = require('fs')
const axios = require('axios');

const port = 3000
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

  async function remove(db,database, collection, documentID){
    let dbo=db.db(database)
    let result = await dbo.collection(collection).deleteOne({_id:documentID});
    return result
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

//signUp
    app.route('/signUp')
            // return the signUp.html
            .get(async function(req, res) {
            // displays intial signUp page.
            // console.log(req);
            res.render('pages/signUp')
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
        .delete(async function(req, res){
            res.send('Got a DELETE request from /userDetail/:userID')
            //pull userID from url
            let ownerID = req.params.userID
            //convert for mango
            let mdbUserID = new ObjectId(ownerID);
            //find user in db
            let user = await find(db, 'Pet-Website-Project', 'Users', { _id: mdbUserID })
            //find pet in db
            let pets = await find(db, 'Pet-Website-Project', 'Pets', { userID: ownerID })

            //check if any pets, if so send Can not delete 
            if (pets.length > 0) {
            res.send("Can not delete user. User has pets")
            } else {
                //remove user from database
                let result = await remove(db, 'Pet-Website-Project', 'Users', mdbUserID)
                res.redirect('/users')
            }

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
            //console.log(req.body.emailAddress)
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
    
            let meds=await find(db,'Pet-Website-Project','MedLog',{petID:animalID})
    
            // convert _ID to a string & add to animal array
            meds.forEach(med => {
                med['medID'] = med._id.toString();
            })
            
            // should petDetail be turned into a template? How do we integrate databse pull with that?
            res.render('pages/petDetail',{
                pet:pet,
                meds:meds
           });
        })
        .delete(async function(req, res){
            res.send('Got a DELETE request')
        })

// edit page for pet
    app.route('/:petID/edit/:petID')
        // calls the petEdit page for the specific pet.
        .get(async function(req, res){
            let petID = req.params.petID
            // convert userID as string into ObjectID for search in MongoDB
            let mdbPetID = new ObjectId(petID);
            // returns the single user as part of an array
            let pet=await find(db,'Pet-Website-Project','Pets',{_id:mdbPetID})
            // pull the user out of the array.
            pet=pet[0];
            pet.petID = petID
            // send variables to the page to be used.
            res.render('pages/petEdit',{
                pet:pet
            });
        })
        .post(async function(req, res){
            // using post becaue PUT doesn't work for the form.
            res.send('Got a POST request in pet/edit/:petID')
            let petID = req.params.petID
            let mdbPetID = new ObjectId(petID);
            //console.log(req.body)
            var newValues=req.body 
            let result=await update(db,'Pet-Website-Project','Pets',mdbPetID,newValues,function(err,result){
                if (err) throw err
                console.log(err)
            })
            res.render()
        })
        .put(async function(req, res){
            let petID = req.params.petID
            let mdbPetID = new ObjectId(petID);
            
            console.log("in pet/edit put")
            console.log(res.body);
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
         res.render('pages/success')
    })


// detail page of a medicine
    app.route('/medDetail/:medID')
        // call the medDetail page and fills in the information.
        .get(async function(req, res){
            let medicineID = req.params.medID
            let mdbMedID = new ObjectId(medicineID)

            let med=await find(db,'Pet-Website-Project','MedLog',{_id:mdbMedID})

            med=med[0];
            med.medID = medicineID;

            let meds=await find(db,'Pet-Website-Project','MedLog',{petID:medicineID})

            meds.forEach(med => {
                med['medID'] = med._id.toString();
            })
            
            res.render('pages/medDetail',{
                med:med,
                meds:meds
            });
        })



//add medication
    app.route('/petDetail/addMedication/:petID')
    .get(async function(req, res){
        let ownerID = req.params.petID
        let mdbPetID = new ObjectId(ownerID)
        let pet=await find(db,'Pet-Website-Project','Pets',{_id:mdbPetID})
        // pull the user out of the array.
        pet=pet[0];
        pet.petID = ownerID
        console.log('in get add med')

        // send variables to the page to be used.
        res.render('pages/addMedication',{
            user:user
        });

    })
    .post(async (req, res) => {
        res.send('Got a POST request in add Med')
        console.log(req.body)
        let ownerID = req.params.petID

        var information=req.body
        
        let result=await insert(db,'Pet-Website-Project','MedLog',information,function(err,result){
            if (err) throw err
            console.log(err)
        })

        console.log()
    })

//edit medication
    app.route('/med/edit/:medID')
        // call the medDetail page and fills in the information.
        .get(async function(req, res){
            res.send('Got a GET request')
        })
        .post(async function(req, res){
            res.send('Got a POST request')
            let medicineID = req.params.medID
            let mdbMedID = new ObjectId(medicineID);

            console.log(req.body)

            var newValues=req.body
            
            let result=await update(db,'Pet-Website-Project','MedLog',mdbMedID,newValues,function(err,result){
                if (err) throw err
                console.log(err)
            })

            res.render()
        })
        .put((req, res) => {
            res.send('Got a PUT request')
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
