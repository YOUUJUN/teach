const router = require('koa-router')();

const fsPromises = require('fs').promises;

const util = require("util");
// const execFile = util.promisify(require("child_process").execFile);

module.exports = {
    index : async (ctx,next) =>{
        console.log("hello");

        ctx.url = '/index.html';

        await next();
    },

    getFile : async (ctx,next) => {
        console.log("ctx",ctx);
        ctx.body = {msg:"msg"};
    }
};