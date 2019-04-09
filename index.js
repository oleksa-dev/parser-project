const Koa = require('koa');
const app = new Koa();
const render = require('koa-ejs');
const routs = require('./routs/index.js');
const path = require('path');
const serve = require('koa-static');
const mount = require('koa-mount');

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'template',
    viewExt: 'html',
});

app
    .use(mount('/public', serve(__dirname + '/public')));
app
    .use(routs);

let port = 4000;
app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
