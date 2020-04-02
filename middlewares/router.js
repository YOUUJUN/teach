const router = require('koa-router')();
const homeController = require('../controler/home');

module.exports = (app) => {

    router.get('/',homeController.index);

    router.post("/getFile",homeController.getFile);

    router.post('/login',homeController.login);
    router.post('/verifyToken',homeController.verifyToken);


    app.use(router.routes())
        .use(router.allowedMethods());
};
