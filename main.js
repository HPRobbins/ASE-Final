const express = require('express')
const app = express()
const port = 3000

app.route('/signUp/')
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

app.route('/users/')
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
    
app.route('/users/:userID')
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

    app.route('/users/:userID/pets')
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
    
app.route('/users/:userID/pets/:petID')
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
    
app.route('/users/:userID/pets/:petID/medlog/:medID')
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
