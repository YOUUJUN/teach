const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa-cors');
const router = require('./middlewares/router');


// error handler
// onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());

// app.use( async (ctx, next) =>{
//   ctx.set("Access-Control-Allow-Origin","http://localhost:8080");
  // ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // ctx.set("Access-Control-Allow-Credentials", true);
  // await next();
// });

// app.use(cors({
//   origin : function (ctx) {
//     return "http://localhost:8080";
//   }
//
// }));



router(app);

app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-static')(__dirname + '/views'));

//添加ejs模板并修改模板后缀为html
// app.use(views(__dirname + '/views', {
//   map : {html:'ejs'}
// }));



// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
