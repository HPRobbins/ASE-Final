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

const jwt=require('jsonwebtoken');
const { errorMonitor } = require('events');
const { strict } = require('assert');
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
    let result=await dbo.collection(collection).find(criteria).toArray()
    return result;
}

  // GETS data from mongoDB
  // returns results as an array.
async function loginFind(db,database,collection,criteria,criteria2){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).find(criteria,criteria2).toArray()
    return result
}

  // PUT data in database via an Update.
  // Returns result of attempt to update.
async function update(db, database, collection, documentID, document){
    let dbo=db.db(database)
    let result=await dbo.collection(collection).updateOne({_id:documentID},{$set:document})
    return result;
}

async function matchJWT(jwt1,jwt2){
    let result = (jwt1 === jwt2)
    return result
}

// for default page, should take user to welcomePage
app.route('/')
    // fetching the basic page. return welcomePage.html
	.get(async function(req, res){
        res.render('pages/welcomePage')
	})
    // unneeded, can be removed/ignored
	.post((req, res) => {
	  res.send('Got a POST request')
	})
    // Yes for a uthentication
	.put(async(req, res) => {
	  // res.send('Got a PUT request for /')
        let email = req.body.emailAddress

        // create first criteria
        let criteria={emailAddress:email}
        // create second criteria
        let criteria2={_id:1,emailAddress:1,password:1,role:1}

        // using a specially crafted Find.
        let result=await loginFind(db,'Pet-Website-Project','Users',criteria,criteria2)

        // if the user exists do stuff.
        if(result.length>0){
            // if password is wrong, send message.
            if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')){
                res.status(406).json({message:'Wrong password'})
            }
            // if password is correct, handle token creation.
            else{
                userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')

                let mdbUserID = new ObjectId(userId);

                // creating a token
                let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})

                // puts jwt token in user's databse file.
                let loginResult=await update(db,'Pet-Website-Project','Users',mdbUserID,{jwt:token},function(err,result){
                    if (err) throw err
                    return result
                })
                if(loginResult.length=1){
                    //res.status(200).setHeader('Authorization',token).json({message:'User authenticated'})
                    console.log(result[0].role)
                    res.setHeader('Set-Cookie', ['type=auth','Authorization= ','Bearer= ',`jwt=${token}`, `role=${result[0].role}`, 'httpOnly=true','Expires=Thu, 11 May 2023 07:28:00 GMT']).status(200).json({'message':"Logged in successfully!"})
                }
                else{
                    res.status(406).json({message:'Login Failed'})
                }
            }
        } 
        else{
            res.status(406).json({message:'User is not registered'})
        } 
        // TODO: Something with this? may not be needed. send response back.
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
            // user already exists, display message.
            if(result.length>0)
            {
                res.status(406).json({message:'User already exists. Go to sign in page.'})
                // res.redirect(406,'/')
                // console.log('User exists.')
            }
            // user does not exist.
            else
            {
                req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
                let newResult=insert(db,'Pet-Website-Project','Users',req.body,function(err,result){
                    if (err) throw err
                    console.log(err)
                    return newResult
                })
                // handle successful creation here.
                res.status(201).json({message:'Success: User created!'})
                //res.redirect(201,'/')
            }
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
    
app.route('/signOut')
    .get((req, res) => {
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


    // If we are keeping index.html, keep this.
app.route('/users/')
    // would return index.html and the list of users
	.get(async function(req, res){
        /* console.log("inside /users/")
        console.log(req.cookies['Bearer'])
        */
       console.log("Cookies in /users/")
       console.log(req.cookies)

        // everything in the Users collection is put into an array called result
        let result=await find(db,'Pet-Website-Project','Users',{})
      
        if(result.length==0){
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
        let ownerID = req.params.userID
        // convert userID as string into ObjectID for search in MongoDB
        let mdbUserID = new ObjectId(ownerID)

        // get info from current user
        let currentJWT=req.cookies.jwt
        let currentRole=req.cookies.role

        // for enabling/disabling parts of page.
        let pathStatus = ""
        let buttonStatus = ""

        console.log('In user detail')
        console.log('/////////////////')

        // Look for the user in the database.
        let user=await find(db,'Pet-Website-Project','Users',{_id:mdbUserID})
        console.log(user)
        
        // check that the user exists
        if(user.length==0)
        {
            res.status(404).json({message:'User not found. Return to user index and try again.'})
        }
        else{
            // pull the user out of the array.
            user=user[0]

            let jwtMatch = matchJWT(user.jwt,currentJWT)
            console.log(jwtMatch)
            // Is current user this user or an admin?
            if(jwtMatch == true|| currentRole == 'admin')
            {
                // set variables
                buttonStatus = 'enabled'
                pathStatus = 'enabled'
            }
            else{
                buttonStatus='disabled'
                pathStatus='disabled'
            }
            
            console.log(buttonStatus)
            console.log(pathStatus)

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
    // can be removed/ignored
    .post((req, res) => {
        res.send('Got a POST request')
    })
    // no updates on this page as currently designed.
    // can be removed/ignored
    .put((req, res) => {
        res.send('Got a PUT request')
    })
    // can be removed/ignored
    .patch((req, res) => {
        res.send('Got a PATCH request')
    })
    // yes,will be used with error handling.
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
        res.send('Got a POST request')
    })
    .put(async function(req, res){
        // using post becaue PUT doesn't work for the form.
        let ownerID = req.params.userID
        let mdbUserID = new ObjectId(ownerID);
        console.log("Insider user/edit/:userID .put")
        
        var newValues=req.body

        // Password does not need to be changed, update the rest.
        if(req.body.password == null)
        {
            let result=await update(db,'Pet-Website-Project','Users',mdbUserID,newValues,function(err,result){
                if (err) throw err
                return result
            })
            
            if(result.modifiedCount == 1)
            {
                res.status(200).json({message:'Success: User updated successfully.'})
            }
            // Update failed.
            else
            {
                res.status(406).json({message:'Failed: User was not updated.'})
            }
        }
        // password needs to be changed.
        else{
             // password salting.
            req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
            let result=await update(db,'Pet-Website-Project','Users',mdbUserID,newValues,function(err,result){
                if (err) throw err
                return result
            })
            // update success!
            if(result.modifiedCount == 1)
            {
                res.status(200).json({message:'Success: User updated successfully.'})
            }
            // Update failed.
            else
            {
                res.status(406).json({message:'Failed: User was not updated.'})
            }
        }
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
    
