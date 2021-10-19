const express = require('express');
const app = express();
const port = 5001;
const exphbs = require('express-handlebars');
const access = require('./routes/access.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use('/cotacao', access);

app.listen(port, '0.0.0.0', () => {
  console.log("server listening on port: " + port)
})