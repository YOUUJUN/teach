const query = require("../db/mysql/query");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const TOKENSECRET = require("../config/tokensecret");

class User {

    async register() {


    }

    async login (info){
        let searchUser = " SELECT * FROM users WHERE user_name = ? ";
        let userParams = [info.username];

        let msg = {};

        let results = await query(searchUser, userParams);

        if(info.username.indexOf(' ')>=0 || info.username == ''){
            msg = {
                info : "请输入用户名!",
                ret_code : '0'
            };
            res.json(msg);
            return;
        }

        else if(info.password.indexOf(' ')>=0 || info.password == ''){
            msg = {
                info : "请输入密码!",
                ret_code : '0'
            };
            res.json(msg);
            return;
        }


        if(results.indexOf(' ')>=0 || results == ''){
            msg = {
                info : "用户名或密码错误！",
                ret_code : '0'
            };

        }else{

            let username = results[0].user_name;
            let nickname = results[0].nickname;
            let userId = results[0].user_id;
            let realPass = results[0].password;

            if(info.password == realPass){

                msg = {
                    info : "登录成功！",
                    ret_code : '1'
                };

                let obj = {
                    username : username,
                    nickname : nickname,
                    userId : userId,
                    password: realPass
                }

                let token = this.createUserToken(obj);
                msg.token = token;

            }else{
                msg = {
                    info : "用户名或密码错误！",
                    ret_code : '0'
                };
            }
        }

        return msg;

    }

    createUserToken (info){

        let fixedPassword = this.encryptPassword(info.password);

        info.password = fixedPassword;

        let userInfo = info;

        let token = jwt.sign(userInfo, TOKENSECRET, {
            expiresIn : "48h",
            issuer : "YOUJUN"
        })

        return token;
    }

    async verifyUserToken(token){
        let _this = this;
        let decodedValue = "";
        jwt.verify(token,TOKENSECRET,function (err, decoded) {
            if(err){
                console.log("别问，问就验证没通过");
                return false;
            }else{
                decodedValue = decoded;
            }
        })

        if(decodedValue && decodedValue.username && decodedValue.password){
            let result = await _this.verifyUserPassword(decodedValue.username,decodedValue.password);

            if(result){
                console.log("decodedValue----====>",decodedValue);
                return decodedValue;
            }
        }

        return false;
    }


    encryptPassword (password){

        const md5 = crypto.createHash("md5");

        let salt = "hellomotherfuckersonofagun";

        md5.update(password+salt);
        return md5.digest('hex');
    }

    async verifyUserPassword (username, pass){
        let searchUser = " SELECT password FROM users WHERE user_name = ? ";
        let userParams = [username];

        let results = await query(searchUser, userParams);

        let encryptedPassword = this.encryptPassword(results[0].password);

        if(encryptedPassword === pass){
            return true;
        }else{
            return false;
        }
    }

}


let user = new User;

module.exports = user;





