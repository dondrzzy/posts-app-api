// load env variables
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var cors = require('cors');
var bodyParser = require('body-parser');
var conf = require('./config/database');

var userRoute = require('./routes/user');
var postsRoute = require('./routes/posts');

var app = express();

//connect to the db
mongoose.connect(conf.dbUri, { useNewUrlParser: true })
//on conn
mongoose.connection.on('connected', () => {
  console.log('connected to database at 27017');
});
//incase of error in conn
mongoose.connection.on('error', err => {
  if (err) { console.log('Error in database conn', err);}    
});

const port = 3000;

var posts = [
  {message: 'Hello'},
  {message: 'Hi there'},
];

//apply middleware

app.use(cors());
app.use(bodyParser.json());

// app.get('/posts', (req, res) => {
//   res.json({posts});
// });

app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postsRoute);

app.listen(port, () => {
  console.log('Server started on port ', port);
});
