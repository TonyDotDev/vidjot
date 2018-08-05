const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// LOAD ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//PASSPORT CONFIG
require('./config/passport')(passport);


// MAP GLOBAL PROMISE -- GET RID OF WARNING
mongoose.Promise = global.Promise;

// CONNECT TO MONGOOSE
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// METHOD OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session())

// CONNECT-FLASH MIDDLEWARE
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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

// USE ROUTES
app.use('/ideas', ideas);
app.use('/users', users);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});