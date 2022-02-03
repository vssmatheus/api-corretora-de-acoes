const request = require('request');

module.exports = (app) => {
  //Retorna a cotação mais recente para a ação
  app.get('/stocks/:stock_name/quote', (req, res) => {
    const stock_name = req.params.stock_name

    try {
      request(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock_name}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`, 
    function (error, response, body) {

      const content = JSON.parse(body);

      res.send({ 
        //stockInfo:content['Global Quote'],
        name: content['Global Quote']?.['01. symbol'],
        lastPrice: Number(content['Global Quote']?.['03. high']),
        pricedAt: content['Global Quote']?.['07. latest trading day'],
      });
    });
    } catch (error) {
      console.error(error);
    }
  });
};
