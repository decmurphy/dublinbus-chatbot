const apiai_router = require('./apiai_router');
const dublinbus_api = require('./dublinbus_api');

exports.handler = (event, context, callback) => {
    var router = new apiai_router(event, context, callback);
    router.handle();
};