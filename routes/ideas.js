const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// LOAD IDEA MODEL
require('../models/Idea');
const Idea = mongoose.model('ideas');

// IDEA INDEX PAGE
router.get('/', (req, res) => {
  Idea.find({})
    .sort({ date: 'descending' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    });
});

// ADD IDEA FORM
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// EDIT IDEA FORM
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea
      })
    })
    .catch(err => {
      res.send(err);
    })
});

// PROCESS FORM
router.post('', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title!' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details!' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', `${idea.title} added`)
        res.redirect('/ideas');
      })
  }
});

// EDIT FORM PROCESS
router.put('/:id', (req, res) => {
  Idea.findByIdAndUpdate(
    req.params.id, {
      title: req.body.title,
      details: req.body.details
    }
  )
    .then(idea => {
      req.flash('success_msg', `Update successful`)
      res.redirect('/ideas');
    })
});


// DELETE IDEA
router.delete('/:id', (req, res) => {
  Idea.findByIdAndRemove({
    _id: req.params.id
  })
    .then(idea => {
      req.flash('success_msg', `${idea.title} removed`)
      res.redirect('/');
    })
});

module.exports = router;