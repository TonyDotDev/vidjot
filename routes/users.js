const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// LOAD USER MODEL
require('../models/User');
const Idea = mongoose.model('users');

// USER LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('users/login');
});

// USER REGISTER ROUTE
router.get('/register', (req, res) => {
  res.render('users/register');
});

// REGISTER FORM POST
router.post('/register', (req, res) => {
  let errors = [];
  let body = req.body;

  if(req.body.password !== req.body.password2) {
    errors.push({text: 'Password do not match'})
  }
  
  if(req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'})
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors,
      name: body.name,
      email: body.email,
      password: body.password,
      password2: body.password2
    })
  }  else {
      res.send('Passed!');
  }
});

module.exports = router;