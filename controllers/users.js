const express = require('express');
const router = express.Router();
const User = require('../models/users')
const bcrypt = require('bcrypt');

// load 'create new user' page
router.get('/new', (req, res) => {
    res.render('users/new.ejs');
});

// create route
router.post('/',async (req,res)=>{
    const name =  req.body.name
    const password =  await bcrypt.hash(req.body.password,10);
    const messages =  req.body.messages
    await User.create({
      name,
      password,
      messages,
    })
    res.redirect('/')
  })

// EXPORT
module.exports = router;