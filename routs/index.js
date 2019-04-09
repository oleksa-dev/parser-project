const router = require('koa-router')();
const apiRouts = require('./apiRouts');
const mainRouts = require('./mainRouts');

apiRouts(router);
mainRouts(router);

module.exports = router.routes();