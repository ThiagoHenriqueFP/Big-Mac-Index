const axios = require('axios');

const api = axios.create({
  BaseURL: 'https://economia.awesomeapi.com.br/json/last/'
});