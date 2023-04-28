const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AHPS:j3ldAJkolXfMb41x@cluster0.znw2b0b.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(function(err,db,targetID,targetCollection){
	if(err) throw err

	const database=db.db('Pet-Website-Project');
    database.collection(targetCollection).find(targetID,function(err, result){
        if (err) throw err
        //console.log(result)
    });

	database.collection(targetCollection).find({}).toArray(function(err, result){
		if (err) throw err
        //console.log(result)
		db.close()
	});
});
