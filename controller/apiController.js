const {JobOffer} = require('../model/connectMongoDB.js');
const {returnCurDate} = require('../parser/parseHelper.js');

async function getOffers(ctx) {
    const limit = 10;
    const propertyObj = 'id postDate jobTitle companyName city salary';
    let { page = 1 } = ctx.query;
    page = Number(page);
    const skip = await (page - 1) * limit;
    ctx.body = await JobOffer.getOffersByParams({skip, limit, propertyObj});
}

async function getOffersPerDay(ctx) {
    ctx.body = await JobOffer.getOffersByParams({params: {postDate: returnCurDate()}});
}

async function getOffer(ctx) {
    const id = {params: ctx.params};
    try {
        let selectedOffer = await JobOffer.getOffersByParams(id);
        selectedOffer = selectedOffer[0];
        ctx.body = selectedOffer;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getOffers,
    getOffersPerDay,
    getOffer
};
