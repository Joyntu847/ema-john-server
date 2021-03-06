const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmh2w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emajohnproject").collection("products");
  const orderCollection = client.db("emajohnproject").collection("orders");
  
  app.post('/addProduct', (req, res) => {

    const products = req.body;
    productCollection.insertOne(products)
      .then(result => {
        res.send(result.insertedCount)
      })
  })

  app.get('/products', (req,res) =>{
    productCollection.find({})
    .toArray((err,documents) =>{
      //console.log(documents)
      res.send(documents)
    })
  })

  app.get('/product/:key', (req,res) =>{
    productCollection.find({key: req.params.key})
    .toArray((err,documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys',(req,res)=>{
    const productKeys = req.body;
    productCollection.find({key: { $in: productKeys}})
    .toArray((err,documents) =>{
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    console.log(req.body)
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hell0 ema john project!')
})


app.listen( process.env.PORT || port)