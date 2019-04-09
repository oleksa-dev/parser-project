const _ = require('lodash');
const {JobOffer} = require('../model/connectMongoDB.js');

async function offerPageAction(ctx) {
    const limit = 10;
    let { page = 1, city, jobTitle, companyName, sortOptions } = ctx.query;
    const params = {city, jobTitle, companyName};
    page = Number(page);
    const count = await JobOffer.getOffersByParams({ count: true, params, sortOptions});
        const skip = await (page - 1) * limit;
        const pageCount = Math.ceil(count / limit);
        let offers = await JobOffer.getOffersByParams({skip, limit, params, sortOptions});
        const viewVariables = {
            title: 'offers page',
            searchResult: 'We find ' +count+ ' offer(s) by your request',
            offers,
            pageCount,
            page,
            query: ctx.query,
            path: ctx.path,
            _,
        };
        await ctx.render('offerpage', viewVariables);
}

async function offerDetailsAction(ctx) {
    let viewVariables = {};
    let template;
    try {
        let selectedOffer = await JobOffer.getOffersByParams({params: ctx.params});
        selectedOffer = selectedOffer[0];
        viewVariables = {
            selectedOffer,
            title: selectedOffer.jobTitle,
            path: ctx.path,
            query: ctx.query
        };
        template = 'offerdetails';
    } catch (e) {
        viewVariables = {
            title: '404 error',
            errorCode: '404 Page Not Found',
            errorMessage: 'Sorry, an error has occurred, Requested page not found!',
            path: ctx.path,
            query: ctx.query,
            _,
        };
            template = 'errorPage';
    }
    await ctx.render(template, viewVariables);
}

module.exports = {
    offerPageAction, offerDetailsAction
};

