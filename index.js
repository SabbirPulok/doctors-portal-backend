const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.get('/',(req,res)=>{
    res.send("Thank You!");
});

//Get The Appointments
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPanel').collection('appointment');
        collection.find().toArray((err , documents) => {
            if(err) {
                res.status(500).send(err)
            }
            else{
                res.send(documents)
            } 
        })
    })
    client.close();
})
app.get('/bookedAppointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPanel').collection('bookedAppointments');
        collection.find().toArray((err , documents) => {
            if(err) {
                res.status(500).send(err)
            }
            else{
                res.send(documents)
            } 
        })
    })
    client.close();
})

app.post('/placeBooking',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const bookedAppointments = req.body;
    client.connect(error => {
        const collection = client.db("doctorsPanel").collection("bookedAppointments");
        collection.insertOne(bookedAppointments,(err,result)=>{
            if(err)
            {
                res.status(500).send({message:err})
                console.log(err);
            }
            else
            {
                res.send(result.ops[0]);
                //console.log(result.ops[0]);
            }
        });
        //client.close();
    });
});
//insert All Appointments
app.post('/addAppointments',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const appointment = req.body;
    client.connect(error => {
    const collection = client.db("doctorsPanel").collection("appointment");
    collection.insert(appointment,(err,result)=>{
        if(err)
        {
            res.status(500).send({message:err})
            console.log(err);
        }
        else
        {
            res.send(result.ops[0]);
            console.log(result.ops[0]);
        }
        //console.log(err);
        client.close();
    });
    
    });
});

const port =process.env.PORT || 4200;
app.listen(port,()=>console.log("Listening to port ",port));