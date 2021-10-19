const express = require('express');
const router = express.Router();
const axios = require('axios');
/* const api = require('../services/apiCotacao'); */

router.get('/', async(req, res) => {
  res.render('pages/home')
});

router.post('/', async(req, res) => {
  let bidApi;
  let subtractRes;
  let percents;
  let purchPower;
  let comparison;
  let destiny = req.body.country;
  let wage = req.body.salario;
  let parsedWage = wage;

  await axios.get(`https://economia.awesomeapi.com.br/last/USD-${destiny}`).then((response) => {
    let nameProprety = Object.keys(response.data)[0];
    bidApi = response.data[nameProprety].bid;
  }).catch(() => {
    console.error();
  });

  function valDesvalCambial(valBigMacYourCounty) {
    let valBigMacEUA = 5.71;
    let price = parseFloat(bidApi).toFixed(2);
    let parsedValBigMacYourCounty = parseFloat(valBigMacYourCounty).toFixed(2);
    comparison = parsedValBigMacYourCounty / valBigMacEUA;
    console.log(`Divisão do valor do bigmac nos EUA e no Brasil: ${comparison} - Cotação dollar: ${bidApi} - Valor do bigmac nos EUA: ${valBigMacEUA} - Valor do bigmac no Brasil: `, parsedValBigMacYourCounty);
    if (price > comparison) {
      console.log("moeda desvalorizada");
      subtractRes = price - comparison;
      percents = (subtractRes * 100) / price;
      console.log(`Porcentagem de desvalorização: ${percents}%`);
    } else if (price < comparison) {
      console.log("moeda valorizada");
      subtractRes = comparison - price;
      percents = (subtractRes * 100) / price;
      console.log(`valorização de: ${percents}%`);
    } else {
      console.log("moeda com mesma cotação");
    }


    purchPower = (parsedWage / price) / (parsedValBigMacYourCounty / price);
    console.log(`Poder de compra: ${purchPower}`);
  }

  valDesvalCambial(req.body.hamburguer);

  res.render('pages/info', {
    bid: bidApi,
    comparison: comparison,
    percents: percents
  });
});

module.exports = router;