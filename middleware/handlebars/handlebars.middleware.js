const exphbs = require('express-handlebars');


// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');