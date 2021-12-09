// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
require('dotenv').config();

// STATIC CONSTANTS
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const MONGO_BASE_URL = process.env.MONGO_BASE_URL;
const MONGO_URL = `${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`

// MIDDLEWARE
// body parser middleware
app.use(express.urlencoded());
app.use(express.json());
// static files middleware
app.use(express.static('public'));
// method-override
app.use(methodOverride("_method"));
// session
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// CONTROLLERS
// fitting room three
const roomController = require('./controllers/room.js');
app.use('/room', roomController);
// create user
const userController = require('./controllers/users.js');
app.use('/users', userController);
// sessions
const sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);

// GET INDEX
app.get('/', (req, res) => {
  res.render('index.ejs', {user:req.session.user});
});


// SEED ROUTE
// NOTE: Do NOT run this route until AFTER you have a create user route up and running, as well as encryption working!
const seed = require('./models/seed.js');
const User = require('./models/users.js');

app.get('/seedAgents', async(req, res) => {
  // encrypts the given seed passwords
  seed.forEach(async(user) => {
    user.password = await bcrypt.hash(user.password,10);
    // seed data
    await User.findOneAndUpdate({name:user.name},user,{upsert:true})
  });
  res.redirect('/')
});

// CONNECTIONS
mongoose.connect(MONGO_URL).then(async () => {
  console.log('connected')
  app.listen(PORT, () => { console.log('listening at PORT:', PORT) })
})
