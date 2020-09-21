const express = require('express');
const router  = express.Router();
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
let path = require('path');
require('./config/database.config');



app.use(
  session({
    secret: 'my-secret-weapon',
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000, //60 sec * 60 min * 24hrs = 1 day (in milliseconds)
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      //time to live (in seconds)
      ttl: 60 * 60 * 24,
      autoRemove: 'disabled',
    }),
  })
);

// Clear the session
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//A library that helps us log the requests in the console
const logger = require('morgan');
app.use(logger('dev'));

const cors = require('cors')
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use body parser. To be able parse post request information
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()) //crucial for post requests from client

//Manish commented this line
app.use(express.static(path.join(__dirname, 'public')));





//Register routes

const authRoutes = require('./routes/auth.routes')
app.use('/api', authRoutes);

const profileRoutes = require('./routes/profile.routes')
app.use('/api', profileRoutes);

const eventRoutes = require('./routes/events.routes')
app.use('/api', eventRoutes);

const vaultRoutes = require('./routes/vault.routes')
app.use('/api', vaultRoutes);

const fileUpload = require('./routes/file-upload.routes')
app.use('/api', fileUpload);


app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});


//Start the server to begin listening on a port
// make sure you don't run it on port 3000 because 
// your react app uses port 3000. 


module.exports=app
