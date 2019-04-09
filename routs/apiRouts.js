const { getOffers, getOffersPerDay, getOffer } = require('../controller/apiController.js');

module.exports = function (router) {
    router
        .get('/api/get-offers',         getOffers)
        .get('/api/get-offers-per-day', getOffersPerDay)
        .get('/api/get-offer/:id',      getOffer);
};
