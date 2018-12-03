const urlController = require('../controllers/url.controller');


module.exports = (app) => {
  app.route('/url/start-monitoring').get(urlController.monitorURLs);
  app.route('/url').get(urlController.getALlURLs);
  app.route('/url/:id').get(urlController.getURL);
  app.route('/url').post(urlController.createURL);
  app.route('/url/:id').put(urlController.updateURL);
  app.route('/url/:id').delete(urlController.deleteURL);
}