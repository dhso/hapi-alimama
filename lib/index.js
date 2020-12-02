"user strict";

const Joi = require("joi");
const Pkg = require("../package.json");
const ApiClient = require("../alimama").ApiClient;

const optionSchema = Joi.object({
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

function register(server, pluginOptions) {
    const { error, value } = optionSchema.validate(pluginOptions);
    if (error) throw error;

    const alimama = new ApiClient({
        appkey: value.appkey,
        appsecret: value.appsecret,
        url: value.url,
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
