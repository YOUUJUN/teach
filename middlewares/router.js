const router = require('koa-router')();
const homeController = require('../controler/home');

module.exports = (app) => {

    router.get('/',homeController.index);

    router.post("/getFile",homeController.getFile);


    app.use(router.routes())
        .use(router.allowedMethods());
};
