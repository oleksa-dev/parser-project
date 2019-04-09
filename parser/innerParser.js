const rp = require('request-promise');
const $ = require("cheerio");
const {JobOffer} = require('../model/connectMongoDB.js');
const helper = require('./parseHelper');
const config = require('config');
const updateOption = config.get('mongoDb.updateOption');

const innerParse = async function innerParse({ postDate, url }) {
    const body = await rp(url);
    let description = helper.parseDescription(body);
    let logo = helper.parseLogo(body);
    let tel = helper.parseTel(body);
    let city = helper.parseCity(body);
    let salary = helper.parseSalary(body);
    let offerUpdAt = helper.returnCurDate();
    let unit = salary === undefined ? undefined : 'UAH';
    let selectorsObj = {
        getId: $('#printout', body).attr('href').replace(/\D+/g, ''),
        getJobTitle: $('#h1-name', body).text(),
        getCompanyName: $('.dl-horizontal a b', body).text(),
        getCompanyLogo: logo,
        getContactPhone: tel,
        getDescription: description,
        getCity: city,
        getSalary: salary,
        getUnitValue: unit,
        getUrlTemplate: 'https://www.work.ua/jobs/'
    };
    //Creating a plain object with offer fields
    const objOffer = {
        id: selectorsObj.getId,
        checked: true,
        updatedAt: offerUpdAt,
        status: 'Active',
        postDate: postDate,
        jobTitle: selectorsObj.getJobTitle,
        companyName: selectorsObj.getCompanyName,
        companyLogo: selectorsObj.getCompanyLogo,
        contactPhone: selectorsObj.getContactPhone,
        description: selectorsObj.getDescription,
        city: selectorsObj.getCity,
        salary: {
            unit: selectorsObj.getUnitValue,
            value: selectorsObj.getSalary
        },
        urlTemplate: selectorsObj.getUrlTemplate + selectorsObj.getId
    };
    //delete null properties
    for(let prop in objOffer) {
        if(objOffer[prop] === undefined || objOffer[prop] === null) {delete objOffer[prop];}
    }
    if(objOffer.salary.value === undefined || objOffer.salary.value === null) {delete objOffer['salary'];}
    //Creating an instance of JobOffer mongoose model
    const offer = new JobOffer(objOffer);
    await JobOffer.updateOffersByParams({id: offer.id}, objOffer, updateOption).catch(e => console.log(e));
    return await Number(objOffer.id);
};

module.exports = {innerParse};
