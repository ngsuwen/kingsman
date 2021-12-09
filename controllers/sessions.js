const express = require('express');
const router = express.Router();
const User = require('../models/users')
const bcrypt = require('bcrypt');

// load login page
router.get('/login', (req, res) => {
    res.render('sessions/login.ejs', {status:req.session.user});
});

// create route
router.post('/', async (req, res) => {
    const name = req.body.name
    const user = await User.findOne({ name: name })
    if (!user) {
        req.session.user = 'invalid'
        req.session.cookie.maxAge = 1000
        res.redirect('/sessions/login')
    } else {
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (isValid) {
            req.session.user = user
            res.redirect('/')
        } else {
            req.session.user = 'invalid'
            req.session.cookie.maxAge = 1000
            res.redirect('/sessions/login')
        }
    }
})

router.delete("/", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// EXPORT
module.exports = router;