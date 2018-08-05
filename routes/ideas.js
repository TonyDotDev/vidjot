const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');



// LOAD IDEA MODEL
require('../models/Idea');
const Idea = mongoose.model('ideas');

// IDEA INDEX PAGE
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'descending' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    });
});

// ADD IDEA FORM
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// EDIT IDEA FORM
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user !== req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea
        })
      }

    })
    .catch(err => {
      res.send(err);
    })
});

// PROCESS FORM
router.post('', ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndRemove({
    _id: req.params.id
  })
    .then(idea => {
      req.flash('success_msg', `${idea.title} removed`)
      res.redirect('/');
    })
});

module.exports = router;