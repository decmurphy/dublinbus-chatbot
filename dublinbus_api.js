const https = require('https');

class dublinbus_api {
    constructor() {
        this.hostname = 'data.dublinked.ie';
        this.path = '/cgi-bin/rtpi';
    }

    _req(method, url, data) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.hostname,
                path: this.path + url,
                method: method
            };

            console.log("Request: " + method + " https://" + options.hostname + options.path)

            const req = https.request(options, (res) => {

                var dataArr = [];
                res.on('data', (d) => {
                    dataArr.push(d);
                });

                res.on('end', function() {
                    console.log("Finished: " + dataArr.join(''));
                    resolve(JSON.parse(dataArr.join('')));
                });
            });

            req.on('error', (e) => {
                console.error(e);
                reject(new Error(e));
            });

            if (data)
                req.write(data);

            req.end();
        });
    }

    _get(url) {
        return this._req('GET', url);
    }

    _post(url, data) {
        return this._req('POST', url, data);
    }

    getRealTimeInfo(stopId) {
        return this._get('/realtimebusinformation?stopId=' + stopId);
    }

    getStopInfo(stopId) {
        return this._get('/busstopinformation?stopId=' + stopId);
    }

}

module.exports = dublinbus_api;