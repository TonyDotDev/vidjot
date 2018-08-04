const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



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
})

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});