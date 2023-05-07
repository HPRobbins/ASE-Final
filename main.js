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
const uri = "mongodb+srv://appclient:GlhvkwLhil4TnIez@pet-website-project.ksy84iw.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
ObjectID = require('mongodb').ObjectID
var db=null
var database='Pet-Website-Project'

const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken');
/* const { errorMonitor } = require('events');
const { strict } = require('assert'); */
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

  //DELETE data to mongoDB
  async function remove(db,database, collection, documentID){
    let dbo=db.db(database)
    let result = await dbo.collection(collection).deleteOne({_id:documentID});
    return result
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

        // using a specially crafted Find. check if the user exists.
        let result=await loginFind(db,'Pet-Website-Project','Users',criteria,criteria2)

        // if the user exists do stuff.
        if(result.length>0){
            // if password is wrong, send message.
            if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')){
                res.status(406).json({message:'Wrong username or password'})
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

                if(loginResult.modifiedCount>0){
                    res.status(200)
                    .cookie('AuthCookie', `${token}`,('SameSite:Lax'))
                    .cookie('RoleCookie', result[0].role,('SameSite:Lax'))
                    .cookie('mdbIDCookie', result[0]._id,('SameSite:Lax'))
                    .json({'message':"Logged in successfully! & Cookie created!"})
                }
                else{
                    res.status(406).json({message:'Login Failed'})
                    res.send()
                }
                return
            }
        } 
        else{
            res.status(404).json({message:'User is not registered'})
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

app.route('/signOut')
    .get(async (req, res) => {
        res.clearCookie('AuthCookie')
        .clearCookie('RoleCookie')
        .clearCookie('mdbIDCookie')
        .status(200)
        .json({'message':"Log out complete, cookies cleard!"})
        console.log("Cookies cleared?")
        console.log(req.cookies)
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


//------------------------USERS----------------------------------------
//list of users
    app.route('/users/')
    // would return index.html and the list of users
	.get(async function(req, res){
        /*
       console.log("Cookies in /users/")
       console.log(req.cookies)
       */
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

       cookiePlate = req.cookies

       console.log(cookiePlate)

        // get info from current user
        let currentJWT=cookiePlate.AuthCookie
        let currentRole=cookiePlate.RoleCookie

        // for enabling/disabling parts of page.
        let pathStatus = ""
        let buttonStatus = ""

        // Look for the user in the database.
        let user=await find(db,'Pet-Website-Project','Users',{_id:mdbUserID})
        
        // check that the user exists
        if(user.length==0)
        {
            res.status(404).json({message:'User not found. Return to user index and try again.'})
        }
        else{
            // pull the user out of the array.
            user=user[0]

            let jwtMatch = matchJWT(user.jwt,currentJWT)
            // console.log(jwtMatch)
            
            // Is current user this user or an admin?
            if(jwtMatch == true || currentRole == 'admin')
            {
                // set variables
                buttonStatus = ' '
                pathStatus = ' '
            }
            else{
                buttonStatus='disabled'
                pathStatus='disabled'
            }

            // readd the string version ofthe _id
            user.userID = ownerID

            let pets=await find(db,'Pet-Website-Project','Pets',{userID:ownerID})

            // convert _ID to a string & add to animal array
            pets.forEach(pet => {
                pet['petID'] = pet._id.toString();
            })

            // send variables to the page to be used.
            res.render('pages/userDetail',{
                buttonStatus:buttonStatus,
                user:user,
                pets:pets
            });
        }
    })

    app.route('/userDetail/delete/:userID')
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
        res.render('pages/deleteUser',{
            user:user
        });
    })
    .delete(async function(req, res){
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

// User edit
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

//-------------------------------------PETS-----------------------------------------

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

// edit page for pet
    app.route('/pet/edit/:petID')
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
            res.render('/petDetail/' +petID)
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

//delete pet
app.route('/petDetail/delete/:petID')
.get(async function(req, res){
    let ownerID = req.params.petID
    // convert userID as string into ObjectID for search in MongoDB
    let mdbPetID = new ObjectId(ownerID);
    // returns the single user as part of an array
    let pet=await find(db,'Pet-Website-Project','Pets',{_id:mdbPetID})
    // pull the user out of the array.
    pet=pet[0];
    pet.petID = ownerID

    // send variables to the page to be used.
    res.render('pages/deletePet',{
        pet:pet
    });
})
.delete(async function(req, res){
    let ownerID = req.params.petID
    //convert for mango
    let mdbPetID = new ObjectId(ownerID);
    //find pet in db
    let pet = await find(db, 'Pet-Website-Project', 'Pets', { _id: mdbPetID })
    //find meds in db
    let meds = await find(db, 'Pet-Website-Project', 'MedLog', { petID: ownerID })

    //check if any pets, if so send Can not delete 
    if (meds.length > 0) {
        res.send("Can not delete pet. Pet has medication")
    } else {
        //remove pet from database
        let result = await remove(db, 'Pet-Website-Project', 'Pets', mdbPetID)
        res.redirect('/userDetail/:userID')
    }
})


//-------------------------------------MEDICINE------------------------------------------

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
                pet:pet
            });

        })
        .post(async (req, res) => {
            console.log(req.body)
            let ownerID = req.params.petID

            var information=req.body

            let result=await insert(db,'Pet-Website-Project','MedLog',information,function(err,result){
                if (err) throw err
                console.log(err)
            })

        })

//edit medication
    app.route('/med/edit/:medID')
    // call the medDetail page and fills in the information.
    .get(async function(req, res){
        let medID = req.params.medID
        // convert userID as string into ObjectID for search in MongoDB
        let mdbMedID = new ObjectId(medID);
        // returns the single user as part of an array
        let med=await find(db,'Pet-Website-Project','MedLog',{_id:mdbMedID})
        // pull the user out of the array.
        med=med[0];
        med.medID = medID
        // send variables to the page to be used.
        res.render('pages/medicationEdit',{
            med:med
        });
    })
    .post(async function(req, res){

        let medicineID = req.params.medID
        let mdbMedID = new ObjectId(medicineID);

        var newValues=req.body
        
        let result=await update(db,'Pet-Website-Project','MedLog',mdbMedID,newValues,function(err,result){
            if (err) throw err
            console.log(err)
        })
        //res.render()
    })
    .put(async function(req, res){
        let medID = req.params.medID
        let mdbmedID = new ObjectId(medID);
        
        console.log("in med/edit put")
        console.log(res.body);
    })

//delete med
app.route('/med/delete/:medID')
.get(async function(req, res){
    let ownerID = req.params.medID
    // convert userID as string into ObjectID for search in MongoDB
    let mdbMedID = new ObjectId(ownerID);
    // returns the single user as part of an array
    let med=await find(db,'Pet-Website-Project','MedLog',{_id:mdbMedID})
    // pull the user out of the array.
    med=med[0];
    med.medID = ownerID

    // send variables to the page to be used.
    res.render('pages/deleteMed',{
        med:med
    });
})
.delete(async function(req, res){
    let ownerID = req.params.medID
    //convert for mango
    let mdbMedID = new ObjectId(ownerID);
    //remove med from database
    let result = await remove(db, 'Pet-Website-Project', 'MedLog', mdbMedID)
    res.redirect('/medDetail/:medID')
    
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
    
