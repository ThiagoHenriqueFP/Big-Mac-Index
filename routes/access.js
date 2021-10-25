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
  let bidApi2020 = 4.14;
  let subtractRes;
  let subtractRes2020;
  let percents;
  let percents2020;
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

  /* await axios.get(`https://economia.awesomeapi.com.br/USD-BRL/10?start_date=20200101&end_date20200101`).then((response) => {
    let nameProprety = Object.keys(response.data)[0];
  	bidApi2020 = response.data[nameProprety].bid;
    console.log(bidApi2020); 
  }).catch(() => {
    console.error();
  }); */

  function valDesvalCambial(valBigMacYourCounty) {
    let valBigMacEUA = 5.65;
    let price = parseFloat(bidApi).toFixed(2);
    let parsedValBigMacYourCounty = parseFloat(valBigMacYourCounty).toFixed(2);
    comparison = parsedValBigMacYourCounty / valBigMacEUA;
    /* console.log(`Divisão do valor do bigmac nos EUA e no Brasil: ${comparison} - Cotação dollar: ${bidApi} - Valor do bigmac nos EUA: ${valBigMacEUA} - Valor do bigmac no Brasil: `, parsedValBigMacYourCounty); */
    infos.push(valBigMacEUA, price)
    if (price > comparison) {
      infos.push('desvalorização');
      subtractRes2020 = price - comparison;
      percents2020 = (subtractRes * 100) / price;
      /* console.log(`Porcentagem de desvalorização: ${percents}%`); */
    } else if (price < comparison) {
      infos.push('Moeda Valorizada')
      subtractRes2020 = comparison - price;
      percents2020 = (subtractRes * 100) / price;
      /* console.log(`valorização de: ${percents}%`); */
    } else {
      infos.push('Valorização');
    }


    purchPower = (parsedWage / price) / (parsedValBigMacYourCounty / price);
    /* console.log(`Poder de compra: ${purchPower}`); */
  }
  valDesvalCambial(req.body.hamburguer);

  function valDesvalCambial2020() {
    let valBigMacYourCounty2 = 19.9;
    let valBigMacEUA = 5.67;
    let price = bidApi2020;
    /* let parsedValBigMacYourCounty = parseFloat().toFixed(2); */
    comparison = valBigMacYourCounty2 / valBigMacEUA;
    /* console.log(`Divisão do valor do bigmac nos EUA e no Brasil: ${comparison} - Cotação dollar: ${bidApi} - Valor do bigmac nos EUA: ${valBigMacEUA} - Valor do bigmac no Brasil: `, parsedValBigMacYourCounty); */
    infos.push(valBigMacEUA, price)
    if (price > comparison) {
      infos.push('desvalorização');
      subtractRes = price - comparison;
      percents2020 = (subtractRes * 100) / price;
      /* console.log(`Porcentagem de desvalorização: ${percents}%`); */
    } else if (price < comparison) {
      infos.push('Moeda Valorizada')
      subtractRes = comparison - price;
      percents2020 = (subtractRes * 100) / price;
      /* console.log(`valorização de: ${percents}%`); */
    } else {
      infos.push('Valorização');
    }

    console.log(percents);
    purchPower2020 = (parsedWage / price) / (valBigMacYourCounty2 / price);
    /* console.log(`Poder de compra: ${purchPower}`); */
  }
  valDesvalCambial2020();

  res.render('pages/info', {
    percents: parseFloat(percents).toFixed(2),
    purchPower: parseFloat(purchPower).toFixed(2),
    purchPower2020: parseFloat(purchPower2020).toFixed(2),
    purchPowerSwitz: purchPowerSwitz,
    purchPowerEuro: purchPowerEuro,
    purchPowerARS: purchPowerARS,
    purchPowerVEF: purchPowerVEF,
    infos: infos,
  });
});

module.exports = router;