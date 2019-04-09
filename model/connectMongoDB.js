const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const uri = config.get('mongoDb.uri');
const helper = config.get('mongoDb.helper');
const conn = mongoose.createConnection(uri, helper);

const typeSchema = new Schema({
    id: {type: Number, default: undefined, index: true},
    status: {type: String, default: 'Active'},
    updatedAt:{type: Date, default: new Date()},
    recordDate: {type: Date, default: new Date()},
    postDate: {type: Date, default: new Date()},
    category: {type: String, default: 'IT'},
    jobTitle: {type: String, default: undefined},
    companyName: {type: String, default: undefined},
    companyLogo: {type: String, default: undefined},
    contactPhone: {type: String, default: undefined},
    description: {type: String, default: undefined},
    city: {type: String, default: undefined},
    salary: {
        unit: {type: String, default: undefined},
        value: {type: Number, default: undefined}
    },
    urlTemplate: {type:String, default: undefined}
});

/**
 * @description Saving typeSchema to mongoDB
 * */

typeSchema.methods.saveOffer = function saveOffer() {
    return new Promise((resolve, reject) => {
        this.save((err, result) => {
            if (err) reject(err);
            resolve (result);
        });
    })
};

/**
 * @description Deleting data from mongoDB
 * @param {Object} [params]
 * @param {Number} [params.id]
 * @param {String} [params.city]
 * @param {Boolean} [params.flag]
 * @param {Boolean} [params.status]
 * @param {String} [params.recordDate]
 * @param {String} [params.postDate]
 * @param {String} [params.jobTitle]
 * @param {String} [params.company]
 * @param {String} [params.company.name]
 * @param {String} [params.salary.value]
 */

typeSchema.statics.deleteOffersByParams =  async function deleteOffersByParams(params) {
    return await this.deleteMany(params, (err, result) => {
        if (err) throw(err);
        return (result);
    });
};

/**
 * @description Find all records in mongoDB database
 * @param {Object} [params] example: {id: 2244565}
 * @param {Number} [limit] by default is null
 * @param {Number} [skip] by default is 10
 * @param {Object} [sortOptions] by default is 10
 * @param {Object} [count] by default is false
 * @param {Object} [propertyObj] name of need field at the DB
 * @return {Object} if @param EMPTY return ALL record`s from DB
 */

typeSchema.statics.getOffersByParams =  async function getOffersByParams( {propertyObj = undefined, count = false, skip = 0, limit = 10000000, params = {}, sortOptions = {}} = {} ) {
    switch(sortOptions) {
        case "descSalary": {sortOptions = {"salary": -1}; break;}
        case "ascSalary": {sortOptions = {"salary": 1}; break;}
        case "descDate": {sortOptions = {"postDate": -1}; break;}
        case "ascDate": {sortOptions = {"postDate": 1}; break;}
        default: {sortOptions = {"postDate": -1}; break;}
    }

    let searchParams = {params: {...params}};

    if (params.city) {
        searchParams.params.city = { "$regex": params.city, "$options": "gi" };
    }
    if (params.jobTitle) {
        searchParams.params.jobTitle = { "$regex": params.jobTitle, "$options": "gi" };
    }
    if (params.companyName) {
        searchParams.params.companyName = { "$regex": params.companyName, "$options": "gi" };
    }

    for(let prop in searchParams.params) {
        if(searchParams.params[prop] === undefined || searchParams.params[prop] === null || searchParams.params[prop].length === 0) {delete searchParams.params[prop];}
    }
    const query = this.find(searchParams.params, function (result) {
      return (result);
    }).select(propertyObj);
    if (count){
      return await query.countDocuments();
    }
    if (limit) {
      query.skip(skip).limit(limit).sort(sortOptions);
    }
    query.sort(sortOptions);
    return await query;
};

/**
 * @description Update a group of records by unique field in mongoDB
 *
 * @param {Object} [findParams] contains conditions that should be identified at the document, example: {city: "Львів"}
 * @param {Object} [updateParams] contains updating data for selected group of records, example: {city: "Вінниця"}
 * @param {Object} [updateOption] options to setup MongoDB queries
 */

typeSchema.statics.updateOffersByParams =  function updateOffersByParams( findParams, updateParams, updateOption ) {
    return new Promise((resolve, reject) => {
      this.updateMany(findParams, updateParams, updateOption, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    })
};

/**
 * @description Count all records in mongoDB
 *
 * @return {Number} [result] quantity of all records in mongoDB
 */

typeSchema.statics.getCountOfRecords =  function getCountOfRecords() {
    return this.countDocuments( function (err, result) {
        if (err) throw(err);
        return (result);
    });
};

const JobOffer = conn.model('JobOffer', typeSchema);

module.exports = {JobOffer};
