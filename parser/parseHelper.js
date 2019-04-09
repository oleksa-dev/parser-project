const $ = require("cheerio");
const config = require('config');
const DOMAIN = config.get('parser.domain');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

let monthMatchingObj = {
    'січня': '01',
    'лютого': '02',
    'березня': '03',
    'квітня': '04',
    'травня': '05',
    'червня': '06',
    'липня': '07',
    'серпня': '08',
    'вересня': '09',
    'жовтня': '10',
    'листопада': '11',
    'грудня': '12',
};

/**
 * @description Parses offer`s dates and links.
 *
 * @param {String} body contains html link to parsed page.
 * @return {Array, Object} offers is an array of obj which contains offer`s dates and links.
 * */
function parseOffers(body) {
    const offers = [];
    // Chooses each selected selector
    $('.card.card-hover', body).each((i, elem) => {
        // Parses each offer`s url
        const offerLink = $(elem).find('a')[0];
        // Parses each offer's title to receive an offer's date
        const title = $(offerLink).attr('title');
        // Splits each date from unnecessary text
        const [ date = '' ] = title.split(', вакансія від ').slice(1, 2);
        // Splits date by space
        const dateArray = date.split(' ');
        // Changes month`s names into numbers
        dateArray[1] = monthMatchingObj[dateArray[1]];
        dateArray[0] = dateArray[0].toString().padStart(2,'0');
        // Pushes offer`s date and url to an array
        const dateObj = dayjs(dateArray.join('-'), "DD-MM-YYYY").format('YYYY-MM-DD');
        offers.push({postDate: dateObj, url: `${DOMAIN}${$(offerLink).attr('href')}` });
    });
    return offers;
}

/**
 * @description Parse pages amount.
 *
 * @param {String} body contains html str.
 * @return {Number} parseInt contains pages amount.
 * */
const pages = function pages(body) {
    const [ allPages ] = $('li span.text-default', body)
        .text()
        .split(' ')
        .slice(3, 4);
    return parseInt(allPages);
};

/**
 * @description Parses job description.
 *
 * @param {String} body contains html String.
 * @return {String} let description contains String after parsing.
 * */
const parseDescription = function parseDescription(body) {

    // Selecting section with description content
    let description = $('h2 ', body).nextUntil('a.btn.btn-default.sendr').text();
    // Cutting unnecessary information
    description = description.substring(0, description.indexOf("Надіслати резюме"));
    // Replacing unnecessary symbols and spaces
    description.replace(/\n/g,' ').trim();

    return description;
};

/**
 * @description Parse company`s logo URL.
 *
 * @param {String} body contains html link to parsed page.
 * @return {String} company`s logo URL.
 * */
const parseLogo = function parseLogo(body) {
    let getLogo = $('.logo-job', body).attr('src');
    // Return url if getLogo = true
    return !getLogo ? undefined : `http:${getLogo}`;
};

/**
 * @description Parses company`s telephone number.
 *
 * @param {String} body contains html link to parsed page.
 * @return {String} company`s telephone.
 * */
const parseTel = function parseTel(body) {
    let parseTel = $('dt:contains(Телефон:)+dd > a[href^="tel"]', body).text();
    if(parseTel.length === 0) { return undefined;}
    return parseTel;
};

/**
 * @description Parses company`s city.
 *
 * @param {String} body contains html link to parsed page.
 * @return {String} company`s city.
 * */
const parseCity = function parseCity(body) {
    let getCity = $(`dt:contains(Місто:)+dd`, body).text();
    if(getCity.length === 0) { return undefined;}
    return getCity;
};

/**
 * @description Parses salary value.
 *
 * @param {String} body contains html link to parsed page.
 * @return {String || Undefined} getSalary contains salary value.
 * */
const parseSalary = function parseSalary(body) {
  let getSalary = $('h3.text-muted.text-muted-print b', body).text();
  if (getSalary.length === 0) { return undefined;}
  return getSalary;
};

/**
 * @description Return current date and time. It looks "10/1/2019"
 * */
const returnCurDate = function returnCurDate(){
    const updatedAt = dayjs().format('YYYY-MM-DD');
    return updatedAt;
};

module.exports = {
    pages,
    parseDescription,
    parseLogo,
    parseTel,
    parseCity,
    parseOffers,
    parseSalary,
    returnCurDate,
};
