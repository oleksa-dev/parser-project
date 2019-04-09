const rp = require('request-promise');
const config = require('config');
const innerParser = require('./innerParser.js');
const parseHelper = require('./parseHelper.js');
const URL = config.get('parser.urlMainPage');
const {JobOffer} = require('../model/connectMongoDB.js');

(async function parseAndUpdStatus () {
    //changing "checked" property to false before parsing operation
    await JobOffer.updateOffersByParams({checked: true}, {$set:{checked: false}});
    //Identifying quantity of the records in DB
    const recsInDb = await JobOffer.getCountOfRecords();
    const dbNotEmpty = (recsInDb > 0);
    const arrayIdsInDB = [];
    //If DB is not empty - creating an array of id's
    if(dbNotEmpty) {
        const offersArray = await JobOffer.getOffersByParams();
        offersArray.forEach((obj, i) => {
            arrayIdsInDB[i] = Number(obj.id);
        })
    }
    const body = await rp(URL);
    const allPages = await parseHelper.pages(body);
    let arrPages = [];
    for(let i = 1; i <= allPages; i++) {
        arrPages.push(URL + i);
    }
    let arrayIdsFromParser = [];
    do {
        let fivePages = arrPages.splice(0, 5);
        const promises = fivePages.map(async (url) => {
            try {
                const body = await rp(url);
                const offers = parseHelper.parseOffers(body);
                //Transferring object offer(date and link), flag and idsArray for matching records in DB
                await Promise.all(offers.map(offer => innerParser.innerParse(offer)
                    .then(id => arrayIdsFromParser.push(id))));
            } catch (err) {
                console.error('url failed', err);
            }
        });
        await Promise.all(promises);
    } while (arrPages.length);
    console.log('All data successfully parsed and saved!');
    //Updates status to 'InActive' if the offer is not available anymore
    arrayIdsInDB.forEach(async function(id) {
        let idExists = arrayIdsFromParser.includes(id);
        if(!idExists) {
            await JobOffer.updateOffersByParams({id: id}, {$set:{status: 'InActive'}});
        }
    });
    console.log("Status updated!");
})();
