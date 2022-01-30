const request = require('request');

module.exports = (app) => {
  app.post('/api/stocks', (req, res, next) => {

    request(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`, 
    function (error, response, body) {

      const content = JSON.parse(body);

      res.send({ 
        sucess: true,
        message: 'OK',
        stockInfo: content['Time Series (Daily)']['2022-01-28'],
      });
    });
  });
};
