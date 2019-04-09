## INTRODUCTION

The main purpose of the project is to parse information by predefined criteria from the **IT** section 
of the **[work.ua](https://www.work.ua/jobs-it/?advs=1)** website, save and store it into the database 
with the realization of transmitting parsed data to the client by API in JSON format.

The **Parser project** is realized on **[Node js](https://nodejs.org)**, 
**[Koa js](https://koajs.com/)** framework and **[MongoDB](https://www.mongodb.com)**.

## HOW IT WORKS

The **Parser** focused on gathering such information as:
* an offer's `id`;
* an offer advertisement publication `date`;
* a `job title`;
* a `company name` and a `logo`;
* a `contact phone`;
* an `offer description`;
* a `city` of job location;
* a `salary`.

After parsing required information with the usage of `mainParser.js` and `innerParser.js`, 
processed data writes into the job offers advertisements, according to chosen fields into 
the database, for it storing and outputting.


During the **Parser** work, it accumulates each new offer to the database. 
If the incoming offer confronts with an offer which already exists in database - the existing 
offer updates by the incoming one. 


If an offer already unavailable at work.ua - the **Parser** changes _**status field**_ in database
from `Active` to `InActive`.
So, it prevents to write the doubles of the offers in data

## HOW TO USE

For appropriate work of the program _**executes**_ `scripts` from `package.json`.

##### Development
Execute:
1. _**start-mongo-dev**_ - launches **MongoDB** from **Docker**;
2. _**start**_ - launches the server, `index.js` in our case;
3. _**start-parser**_ - launches `mainParser.js` execution;
4. _**build-docker**_ - launches `docker build` for making an image of the program;
5. _**docker-run-dev**_  - launches `docker run` for running docker image;



##### Production
Execute:
1. _**start-prod**_ - launches:

    a. _**start-mongo-prod**_ - launches **MongoDB** from **Docker**;
    
    b. _**docker-run-prod**_ - launches `docker run` for running docker images;
 
2. _**docker-stop**_ - stops app:
   
   a. _**docker-stop:parser**_ - stops production Docker image of **Parser**;
   
   b. _**docker-stop:mongo**_ - stops production Docker image **database**;


## MANAGING AND API

For managing and displaying offers parsed offers as a website or get offers through the API, 
run _**http://localhost:4000/**_ at your favorite web browser. 

The following `routes` help to get needed offers with `GET` _request_:
* _**http://localhost:4000/api/get-offers**_ (get 10 offers with pagination). _**Gets**_ the page number as an input 
argument and _**returns**_ values of: offer id, company, job title, salary value, city and date of the offer publication.
* _**http://localhost:4000/api/get-offers-per-day**_ (get all new offers per current day). _**Returns**_ all 
advertisements for current date.
* _**http://localhost:4000/api/get-offer/:id**_ (get 1 offer by `id`). _**Gets**_ the offer id as an input argument 
and _**returns**_ an object with all offer's information.
