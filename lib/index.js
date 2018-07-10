'user strict'

const Joi = require('joi')
const Pkg = require('../package.json')
const ApiClient = require('../alimama').ApiClient;

const singleOption = Joi.object({
    'appkey': Joi.string().required(),
    'appsecret': Joi.string().required(),
    'url': Joi.string().optional().default('http://gw.api.taobao.com/router/rest'),
    'spid': Joi.string().optional(),
    'zpid': Joi.string().optional(),
    'adzoneid': Joi.string().optional(),
    'siteid': Joi.string().optional()
})

async function register(server, pluginOptions) {
    let options
    try {
        options = await singleOption.validate(pluginOptions)
    } catch (err) {
        throw err
    }

    const alimama = new ApiClient({
        'appkey': options.appkey,
        'appsecret': options.appsecret,
        'url': options.url
    })

    const alimamaExecute = (command, params) => {
        return new Promise(function(resolve, reject) {
            alimama.execute(command, params, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };

    server.decorate('toolkit', 'alimama', alimama);
    server.decorate('toolkit', 'alimamaExecute', alimamaExecute);
}
exports.plugin = {
    register: register,
    pkg: Pkg
}