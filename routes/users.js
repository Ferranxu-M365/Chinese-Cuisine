const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/AsyncHandler');
const passport = require('passport');
// REQUIRE CONTROLLERS
const users = require('../controllers/users');

// REGISTER A USER: FORM AND CREATE A USER
router.route('/register')
    .get(users.renderRegisterForm)
    .post(asyncHandler(users.newUser));

// LOGIN A USER: FORM AND USER LOGIN
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), asyncHandler(users.login));

// LOGOUT USER
router.route('/logout')
    .get(users.logout);

module.exports = router;