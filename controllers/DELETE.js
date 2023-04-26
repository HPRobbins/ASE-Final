const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AHPS:j3ldAJkolXfMb41x@cluster0.znw2b0b.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// TODO: modify to align with README file

client.connect(function(err,db){
	if(err) throw err
	console.log('Connected to database')

	const database=db.db('mydatabase')
	database.collection('users').deleteOne({firstname:'Nicholas'},function(err,result){
		if (err) throw err
		console.log(result)

		database.collection('users').find({}).toArray(function(err, result){
			if (err) throw err
			console.log(result)
			db.close()
		})
	})
})

