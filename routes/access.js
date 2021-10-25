const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async(req, res) => {
  res.render('pages/home')
});

router.post('/', async(req, res) => {
  //Suiça
  let purchPowerSwitz = 805.15;
  //Europa
  let purchPowerEuro = 387.60;
  //Argentina
  let purchPowerARS = 0.05;
  //Venezuela
  let purchPowerVEF = 0.30;
  //Variáveis
  let bidApi;
  let subtractRes;
  let percents;
  let purchPower;
  let comparison;
  let destiny = req.body.country;
  let wage = req.body.salario;
  let parsedWage = parseFloat(wage).toFixed(2);
  let infos = [];

  await axios.get(`https://economia.awesomeapi.com.br/last/USD-${destiny}`).then((response) => {
    let nameProprety = Object.keys(response.data)[0];
    bidApi = response.data[nameProprety].bid;
  }).catch(() => {
    console.error();
  });

  function valDesvalCambial(valBigMacYourCounty) {
    let valBigMacEUA = 5.65;
    let price = parseFloat(bidApi).toFixed(2);
    let parsedValBigMacYourCounty = parseFloat(valBigMacYourCounty).toFixed(2);
    comparison = parsedValBigMacYourCounty / valBigMacEUA;
    /* console.log(`Divisão do valor do bigmac nos EUA e no Brasil: ${comparison} - Cotação dollar: ${bidApi} - Valor do bigmac nos EUA: ${valBigMacEUA} - Valor do bigmac no Brasil: `, parsedValBigMacYourCounty); */
    infos.push(valBigMacEUA, price)
    if (price > comparison) {
      infos.push('desvalorização');
      subtractRes = price - comparison;
      percents = (subtractRes * 100) / price;
      /* console.log(`Porcentagem de desvalorização: ${percents}%`); */
    } else if (price < comparison) {
      infos.push('Moeda Valorizada')
      subtractRes = comparison - price;
      percents = (subtractRes * 100) / price;
      /* console.log(`valorização de: ${percents}%`); */
    } else {
      infos.push('Valorização');
    }


    purchPower = (parsedWage / price) / (parsedValBigMacYourCounty / price);
    /* console.log(`Poder de compra: ${purchPower}`); */
  }
  valDesvalCambial(req.body.hamburguer);

  res.render('pages/info', {
    percents: parseFloat(percents).toFixed(2),
    purchPower: parseFloat(purchPower).toFixed(2),
    purchPowerSwitz: purchPowerSwitz,
    purchPowerEuro: purchPowerEuro,
    purchPowerARS: purchPowerARS,
    purchPowerVEF: purchPowerVEF,
    infos: infos,
  });
});

module.exports = router;