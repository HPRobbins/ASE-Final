const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AHPS:j3ldAJkolXfMb41x@cluster0.znw2b0b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("Pet-Website-Project").collection("Pets");
  console.log(collection);
  // perform actions on the collection object
  client.close();
});