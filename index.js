const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = 5500
const request = require('request');

app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json())


app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
    //res.sendFile('pages/home/home.html')
})


var price;

request('https://economia.awesomeapi.com.br/last/USD', function(error, response, body) {
  if (error) { console.log("error: ", error) }
  parsed = JSON.parse(body)
  price = parsed.USDBRL.bid
})

function valDesvalCambial(valBigMacYourCounty, valBigMacEUA) {
  let comparison = valBigMacYourCounty / valBigMacEUA
  if (price > comparison) {
    console.log("moeda desvalorizada")
  } else if (price < comparison) {
    console.log("moeda valorizada")
  } else {
    console.log("moeda com mesma cotação")
  }
}

app.listen(port, '0.0.0.0', () => {
  console.log("server listening on port: " + port)
})