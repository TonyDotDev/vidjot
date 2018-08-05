const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


// MAP GLOBAL PROMISE -- GET RID OF WARNING
mongoose.Promise = global.Promise;

// CONNECT TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// LOAD IDEA MODEL
require('./models/Idea');
const Idea = mongoose.model('ideas');

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// METHOD OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// CONNECT-FLASH MIDDLEWARE
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// INDEX ROUTE
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title
  });
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about');
});

// IDEA INDEX PAGE
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'descending' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    });
});

// ADD IDEA FORM
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// EDIT IDEA FORM
app.get('/ideas/edit/:id', (req, res) => {
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
app.post('/ideas', (req, res) => {
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
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndRemove({
    _id: req.params.id
  })
    .then(idea => {
      req.flash('success_msg', `${idea.title} removed`)
      res.redirect('/ideas');
    })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});