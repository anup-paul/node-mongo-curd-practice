const express = require('express');
const bodyParser = require('body-Parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
// console.log(process.env.BD_NAME);


const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.8rvdv.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))


app.get('/', (req, res) => {
    // res.send('hello i am working');
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
    const studentCollection = client.db("studentInformationdb").collection("students");
    // console.log("database-connected")
    
    app.post("/addStudent", (req, res) =>
    {
        const student = req.body;
        studentCollection.insertOne(student)
        .then (result =>
            {
                // console.log("data added successfully")
                // res.send('successfully done');
                res.redirect('/');
            })
    })


    app.get('/students',(req, res) =>
    {
        studentCollection.find({})
        .toArray((err, documents) =>
        {
            res.send(documents);
        })
    })


    app.get('/student/:id', (req, res)=>
    {
        studentCollection.find({_id:ObjectId(req.params.id)})
        .toArray((ere, documents)=>
        {
            // console.log(documents);
            res.send(documents[0]);
        })
    })


    app.patch('/update/:id', (req, res)=>
    {
        studentCollection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set:{profession : req.body.profession, address : req.body.address}
        })
        .then(result =>
            {
               res.send(result.matchedCount > 0)
            })
    })


    app.delete('/delete/:id', (req, res) =>
    {
        studentCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result =>
            {
               res.send(result.deletedCount > 0)
            })
    })
   
});


app.listen(4000);