var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var objectId = require('mongodb').ObjectID;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
app.get('/animals', function(req, res){
  var url = "mongodb://localhost:27017/farm";
  //two args passed, error msg and the db itself
  MongoClient.connect(url, function(err, db){
    //like request.status, checking that connection was successful
    if(err){
      //err message output
      console.log("Unable to connect to database error:", err);
    }else{
      //otherwise connected ok and continue...
      console.log("Successfuly connected to MongoDB!");
      //finds collection
      var collection = db.collection('animals');
      //converts db collection into JS array
      collection.find({}).toArray(function(err, docs){
        //creates a JSON file
        res.json(docs);
        //close db
        db.close();
      })
    }
  })
})

app.post('/animals', function(req, res){
  res.status(200).end();

  var url = "mongodb://localhost:27017/farm";
  //two args passed, error msg and the db itself
  MongoClient.connect(url, function(err, db){
    //like request.status, checking that connection was successful
    if(err){
      //err message output
      console.log("Unable to connect to database error:", err);
    }else{
      //otherwise connected ok and continue...
      console.log("Successfuly connected to MongoDB!");
      //finds collection
      var collection = db.collection('animals');

      // simpler way of doing it below
      //collection.insert({
      //  name: req.body.name,
      //  type: req.body.type,
      //  age: req.body.age
      //)

      //inserts new document and handles errors
      collection.insert(req.body, function (err) {
        if (err) {
          console.log("Error while inserting document:", err);
          res.status(200)
        } else {
          console.log('Document inserted successfuly');
        }
        //close connection to mongo
        db.close();
      });
    }
  })
})

app.put('/animals/:id', function(req, res){
  res.status(200).end();

  var url = "mongodb://localhost:27017/farm";
  //two args passed, error msg and the db itself
  MongoClient.connect(url, function(err, db){
    //like request.status, checking that connection was successful
    if(err){
      //err message output
      console.log("Unable to connect to database error:", err);
    }else{
      //otherwise connected ok and continue...
      console.log("Successfuly connected to MongoDB!");
      //finds collection
      var collection = db.collection('animals');
      console.log("ID-REQ", req)
      //inserts new document and handles errors
      console.log("ID:",req.params.id)
      collection.updateOne({_id: new objectId(req.params.id)}, {$set: req.body}, function (err) {
        if (err) {
          console.log("Error while updating document:", err);
          res.status(200).end();
        } else {
          console.log('Document updated successfuly');
        }
        //close connection to mongo
        db.close();
      });
    }
  })
})

app.delete('/animals/:id', function(req, res){
  res.status(200).end();

  var url = "mongodb://localhost:27017/farm";
  //two args passed, error msg and the db itself
  MongoClient.connect(url, function(err, db){
    //like request.status, checking that connection was successful
    if(err){
      //err message output
      console.log("Unable to connect to database error:", err);
    }else{
      //otherwise connected ok and continue...
      console.log("Successfuly connected to MongoDB!");
      //finds collection
      var collection = db.collection('animals');

      //inserts new document and handles errors
      var updateBody = req.body;

      collection.remove({_id: new objectId(req.params.id)}, function (err) {
        if (err) {
          console.log("Error while deleting document:", err);
          res.status(200)
        } else {
          console.log('Document deleted successfuly');
        }
        //close connection to mongo
        db.close();
      });
    }
  })
})

app.listen('3000', function(){
  console.log("Server running on port:3000");
})