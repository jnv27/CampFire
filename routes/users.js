const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegisterForm) // render register form
    .post(users.registerUser) // Registers the user

router.route('/login')
    .get(users.renderLoginForm) // render login form
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser) // login user

router.get('/logout', users.logoutUser); // logout user

module.exports = router;