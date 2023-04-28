const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AHPS:j3ldAJkolXfMb41x@cluster0.znw2b0b.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// TODO: Modify to align with README

client.connect(function(err,db,targetIdent,targetCollection,replacement){
	if(err) throw err
	const database=db.db('Pet-Website-Project')
	database.collection(targetCollection).replaceOne(targetIdent,replacement,function(err,result){
		if (err) throw err
		// console.log(result)
	})
	// needs to be called from the .updateOne function or put inside of it.
	database.collection(targetCollection).find({}).toArray(function(err, result){
		if (err) throw err
		// console.log(result)
		db.close()
	})
})