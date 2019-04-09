const { offerPageAction, offerDetailsAction } = require('../controller/indexController');
const { homePageAction, errorPageAction }     = require('../controller/mainController');

module.exports = function (router) {
    router
        .get('/',              homePageAction)
        .get('/offerpage',     offerPageAction)
        .get('/offerpage/:id', offerDetailsAction)
        .all('**',             errorPageAction);
};
