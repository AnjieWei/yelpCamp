const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const user = require('../controller/user')
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user.registerRender)
    .post(catchAsync(user.register));

router.route('/login')
    .get(user.loginRender)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.login)

router.get('/logout', user.logout)  

module.exports = router;