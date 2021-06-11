const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqa8e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send("Hello from server side")
  console.log("database connected")
})


client.connect(err => {

  const appointmentCollection = client.db("jamuna").collection("list");

    // add appointment
  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result =>{
      res.send(result.insertedCount > 0 )
    })
  })



  app.get("/allAppointments", (req, res) =>{
    appointmentCollection.find({})
    .toArray((err, patients) => {
      res.send(patients)
    })
  })

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection.find({date: date.date})
    .toArray((err, documents) => {
      res.send(documents)
    })
    
  })




  console.log(err);



});



app.listen(process.env.PORT || port)