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
var database='Pet-Website-Project'

const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')
const jwt_expiration=86400000
const jwtsalt='privatekey'

const salt='$2b$10$Imnq7Q2r0RS7DqaKV0rpPe'

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
// returns result of attempt.
async function insert(db,database,collection,document){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).insertOne(document)
    return result;
  }
  
  // GETS data from mongoDB
  // returns results as an array.
  async function find(db,database,collection,criteria){
    let dbo=db.db(database)
    console.log(criteria)
    let result=await dbo.collection(collection).find(criteria).toArray()
    return result;
  }

  // GETS data from mongoDB
  // returns results as an array.
  async function loginFind(db,database,collection,criteria,criteria2){
    let dbo=db.db(database)
    console.log(criteria2)
    let result=await dbo.collection(collection).find(criteria,criteria2).toArray()
    return result;
  }

  // PUT data in database via an Update.
  // Returns result of attempt to update.
  async function update(db, database, collection, documentID, document){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).updateOne({_id:documentID},{$set:document})
    
    return result;
  }-

  // checks the currently logged in user.
async function checkUser(token){
	let result=await database.collection('users').find({jwt:token},{_id:1}).toArray();
	console.log('in checkUser')
	console.log(result)
	if(result.length>0){
		let authcheck = result[0]._id.toString().replace('New ObjectId("','').replace('")','')
		console.log('in checkUser if statement')
		return authcheck
	}
	return null
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
	.put(async(req, res) => {
	  // res.send('Got a PUT request for /')
        let email = req.body.emailAddress
        let password = req.body.password
        let ownerID = req.body.userID
        let mdbUserID = new ObjectId(ownerID);

        let criteria={emailAddress:email}
        console.log(criteria)
        let criteria2={_id:1,emailAddress:1,password:1}

        // using a specially crafted Find.
        let result=await loginFind(db,'Pet-Website-Project','Users',criteria,criteria2,function(err, result){
            console.log(result)
            if (err) throw err
            // if the user does not exist, send back an error message.
            if(result.length==0) res.status(406).json({message:'User is not registered'})
            else{
                // if password is wrong, send message.
                if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) return res.status(406).json({message:'Wrong password'})
                // if password is correct, handle token creation.
                else{
                    userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')
                    // creating a token
                    let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})

                    // actually does the update
                    let loginResult = update(db,'Pet-Website-Project','Users',{_id:mdbUserID},{$set:{jwt:token}},function(err,result){
                        if (err) throw err
                        // if update is complete, sends this back.
                        res.status(200).setHeader('Authorization', `Bearer ${token}`).json({message:'User authenticated'})
                    })
                }
            } 
        })
        res.send()
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
	.post(async(req, res) => {
        let email = req.body.emailAddress

        // check if user exists.
        let result=await find(db,'Pet-Website-Project','Users',{emailAddress:email})
            console.log(result)
            // user already exists, display message.
            if(result.length>0)
            {
                res.status(406).json({message:'User already exists'})
                // console.log('User exists.')
            }
            // user does not exist.
            else
            {
                console.log("inserting into database")
                req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
                let newResult=insert(db,'Pet-Website-Project','Users',req.body,function(err,result){
                    if (err) throw err
                    console.log(err)
                    return newResult
                })
            }
    
        /*
        // check if user exists.
        database.collection('users').find({email:req.body.email},{email:1}).toArray(async function(err, result){
            console.log('in /signUp/ post')
            console.log(res.body)
            if (err) throw err
            // if user exists, display message.
            if(result.length>0) res.status(406).json({message:'User already exists'})
            // else, insert user info.
            else{
                req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
                let result=await insert(db,'Pet-Website-Project','Users',req.body)
                console.log(result)
                database.collection('users').insertOne(req.body,function(err,result){
                    if (err) throw err
                    res.status(201).json({message:'User created'})
                })
            }
        })
        */
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
        let ownerID = req.params.userID
        let mdbUserID = new ObjectId(ownerID);

        var newValues=req.body
        console.log(newValues)
        
        let result=await update(db,'Pet-Website-Project','Users',mdbUserID,newValues,function(err,result){
            if (err) throw err
            console.log(err)
            return result
        })
        console.log(result)
        // update success!
        if(result.modifiedCount == 1)
        {
            // alert('The user has been updated. Please return to the user detail page.')
            console.log('The user has been updated. Please return to the user detail page.')
        }
        else
        {
            res.send(alert('TODO: Error Code here'))
        }

         // TODO: Send user somewhere, tell user it succeeded, something.
        // res.render()
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

    // detail page of a medicine
app.route('/users/:userID/pets/:petID/medlog/:medID')
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
    
