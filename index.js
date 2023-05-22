const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eqk9iwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      //  client.connect();

      const addToyCollection = client.db('babybo').collection('babybos');


      app.get('/allToy', async (req, res) => {
         const toy = await addToyCollection.find({}).toArray();
         res.send(toy)
      })

      app.get('/viewdetails/:id', async (req, res) => {
         const id = req.params.id
         const toy = await addToyCollection.findOne({ _id: new ObjectId(id) })
         res.send(toy)
      })

      app.get("/mytoy/:userEmail", async(req, res)=>{
         const userEmail = req.params.userEmail;
         const myToy = await addToyCollection.find({sellerEmail: userEmail}).toArray();
         res.send(myToy)
       });


      app.post('/addToy', async (req, res) => {
         const toy = req.body
         const result = await addToyCollection.insertOne(toy);
         res.send(result)
      })

      


      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      //  await client.close();
   }
}
run().catch(console.dir);




app.get('/', (req, res) => {
   res.send('Babybo is running')
})

app.listen(port, () => {
   console.log(`BabyBo Server is running on port ${port}`)
})