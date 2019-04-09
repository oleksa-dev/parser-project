const _ = require('lodash');
const {JobOffer} = require('../model/connectMongoDB.js');


async function errorPageAction(ctx) {
    const viewVariables = {
        title: '404 error',
        errorCode: '404 Page Not Found',
        errorMessage: 'Sorry, an error has occurred, Requested page not found!',
        path: ctx.path,
        query: ctx.query,
        _,
    };
    await ctx.render('errorPage', viewVariables);
}

async function homePageAction(ctx) {
    ctx.query = {};
    const numberOfPages = await JobOffer.getCountOfRecords();
    const viewVariables = {
        title: 'Team-T Server',
        numberOfPages,
        path: ctx.path,
        query: ctx.query,
        _,
    };
    await ctx.render('mainpage', viewVariables);
}

module.exports = {
    homePageAction, errorPageAction
};
