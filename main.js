const express = require('express')
const app = express()
const port = 3000

// for default page, should take user to welcomePage
app.route('/')
    // fetching the basic page. return welcomePage.html
	.get((req, res) =>{
	  // res.send('Got a GET request')
      let homepage=fs.readFileSync('./public/welcomePage.html', 'utf8');
      res.send(homepage);
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

app.route('/signUp/')
    // return the signUp.html
	.get((req, res) =>{
	  // displays intial signUp page.
      let signUp=fs.readFileSync('./public/signUp.html', 'utf8');
      res.send(signUp);
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
	.get((req, res) =>{
	  // res.send('Got a GET request')
      let index=fs.readFileSync('./public/index.html', 'utf8');
      // TODO: need to either call pages.index in app.js or handle populating the data another way.
      // maybe rework what's in database.js?
      res.send(index);
	})
    // possibly unneeded
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
app.route('/users/:userID')
    // get details of user & the userDetail page
    // also returns all pets owned by user.
    .get((req, res) =>{
    // res.send('Got a GET request')
        let userID = req.params.userID
     // should this be calling userDetails or userDetail?
     // TODO: have it pull the data from the database and populate the html page.
        let userDetail=fs.readFileSync('./public/Users/userDetail.html', 'utf8');
        res.send(userDetail);
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
        res.send('Got a DELETE request')
    })

     // calls the userEdit page for a specific user
app.route('/users/:userID/edit')
    // get details of user & the userEdit page
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

    // This whole route is unneeded. we do not have a page that lists only the pets of a user.
    /* app.route('/users/:userID/pets')
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
        */
    
    // detail page for a specific pet
app.route('/users/:userID/pets/:petID')
    // returns petDetail with information of the specific pet and any medicines its on.
    .get((req, res) =>{
        // res.send('Got a GET request')
        let petDetail=fs.readFileSync('./public/pet/petDetail.html', 'utf8');
        // should petDetail be turned into a template? How do we integrate databse pull with that?
        res.send(petDetail);
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
app.route('/users/:userID/pets/:petID/edit')
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

    // we don't have a page that lists all the medications of a specific pet, good future feature
    // irl use case: print out list of medications to take to the vet
app.route('/users/:userID/pets/:petID/medlog')
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
