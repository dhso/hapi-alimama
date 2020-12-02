"user strict";

const Joi = require("joi");
const Pkg = require("../package.json");
const ApiClient = require("../alimama").ApiClient;

const singleOption = Joi.object({
    appkey: Joi.string().required(),
    appsecret: Joi.string().required(),
    url: Joi.string()
        .optional()
        .default("http://gw.api.taobao.com/router/rest"),
    spid: Joi.string().optional(),
    zpid: Joi.string().optional(),
    adzoneid: Joi.string().optional(),
    siteid: Joi.string().optional(),
});

async function register(server, pluginOptions) {
    let options;
    try {
        options = await singleOption.validate(pluginOptions);
    } catch (err) {
        throw err;
    }

    const alimama = new ApiClient({
        appkey: options.appkey,
        appsecret: options.appsecret,
        url: options.url,
    });

    const alimamaExecute = (apiname, params) => {
        return new Promise(function (resolve, reject) {
            alimama.execute(apiname, params, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    const alimamaExecuteWithHeader = (apiname, params, httpHeaders = {}) => {
        return new Promise(function (resolve, reject) {
            alimama.executeWithHeader(
                apiname,
                params,
                httpHeaders,
                function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
    };

    const alimamaGet = (apiname, params) => {
        return new Promise(function (resolve, reject) {
            alimama.get(apiname, params, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    server.decorate("toolkit", "alimama", alimama);
    server.decorate("toolkit", "alimamaExecute", alimamaExecute);
    server.decorate(
        "toolkit",
        "alimamaExecuteWithHeader",
        alimamaExecuteWithHeader
    );
    server.decorate("toolkit", "alimamaGet", alimamaGet);
}
exports.plugin = {
    register: register,
    pkg: Pkg,
};
