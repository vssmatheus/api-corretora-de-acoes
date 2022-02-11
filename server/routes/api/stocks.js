const request = require('request');

const baseUrl = `https://www.alphavantage.co`

module.exports = (app) => {
  //Retorna a cotação mais recente para a ação
  app.get('/stocks/:stock_name/quote', (req, res) => {
    const stock_name = req.params.stock_name

    try {
      request(`${baseUrl}/query?function=GLOBAL_QUOTE&symbol=${stock_name}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`, 
      function (error, response, body) {

        const content = JSON.parse(body);

        res.send({ 
          //stockInfo: content['Global Quote'],
          name: content['Global Quote']?.['01. symbol'],
          lastPrice: Number(content['Global Quote']?.['03. high']),
          pricedAt: content['Global Quote']?.['07. latest trading day'],
        });
      });
    } catch (error) {
      console.error(error);
    }
  });

  //Retorna preço histórico da ação num intervalo inclusivo
  app.get('/stocks/:stock_name/history', (req, res) => {
    const stock_name = req.params.stock_name
    const { from, to } = req.query

    try {
      request(`${baseUrl}/query?function=TIME_SERIES_DAILY&symbol=${stock_name}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
      (error, response, body) => { 
        const content = JSON.parse(body);
        const days = Object.keys(content['Time Series (Daily)']).filter(day => day >= from && day <= to )
        res.send({
          name: stock_name,
          prices: days.map(day => ({
            opening: Number(content['Time Series (Daily)'][day]['1. open']),
            closing: Number(content['Time Series (Daily)'][day]['4. close']),
            high: Number(content['Time Series (Daily)'][day]['2. high']),
            low: Number(content['Time Series (Daily)'][day]['3. low']),
            pricedAt: day
          }))
        })
      })
    } catch (e) {
      console.error(e);
    }
  });

  //Projeta ganhos com compra em uma data específica
  app.get('/stocks/:stock_name/gains', (req, res) => {
    const stock_name = req.params.stock_name
    const { purchasedAmount, purchasedAt } = req.query

    try {
      request(`${baseUrl}/query?function=EARNINGS&symbol=${stock_name}&horizon=3month&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
      function (error, response, body) {

        const content = JSON.parse(body);
        const gains = Object.keys(content['quarterlyEarnings']).slice(purchasedAmount || purchasedAt)

        res.send({
          //stockInfo: content['quarterlyEarnings'],
          prices: gains.map(gain => ({
            fiscalDateEnding: content['fiscalDateEnding)'],
            pricedAt: gain
          }))
        });
      });
    } catch (error) {
      console.error(error);
    }
  });
};
