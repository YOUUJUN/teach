const router = require('koa-router')();

const fsPromises = require('fs').promises;

const util = require("util");
// const execFile = util.promisify(require("child_process").execFile);

const page_user = require("../utils/pages/user");

module.exports = {
    index : async (ctx,next) =>{
        console.log("hello");

        ctx.url = '/index.html';

        await next();
    },

    getFile : async (ctx,next) => {
        console.log("ctx",ctx);
        ctx.body = {msg:"msg"};
    },


    /*--user--*/

    async login (ctx, next){

        let body = ctx.request.body;

        try {
            let results = await page_user.login(body);

            ctx.body = results;
        }catch (err) {
            console.error(err);
            ctx.body = {
                info:"未知错误，请联系管理员!"
            }
        }

    },

    async verifyToken (ctx, next) {
        let msg = {
            status: 0,
            logged: false
        }

        let token = ctx.request.header.accesstoken || "";
        try {
            let result = await page_user.verifyUserToken(token);
            console.log("result--------------",result);

            if(result){
                msg.logged = true;
            }else{
                msg.logged = false;
            }
            msg.status = 1;
        }catch (e) {
            console.error(e);
            msg.status = 0;
            msg.logged = false;
        }

        ctx.body = msg;
    }
};