const dublinbus_api = require('./dublinbus_api');

class apiai_router {

    constructor(event, context, callback) {
        this.event = event;
        this.context = context;
        this.callback = callback;

        console.log("REQ1: " + JSON.stringify(this.event));

        this.api = new dublinbus_api();

        this.favourites = {
            7: 3229,
            145: 5127
        };
    }

    handle() {

        console.log("REQ2: " + JSON.stringify(this.event));
        switch (this.event.result.action) {
            case 'GetRealTimeInfo':
                this.getRealTimeInfo();
        }
    }

    getRealTimeInfo() {

        var route = this.event.result.parameters.number;
        var direction = this.event.result.parameters.direction;

        var stopId = this.getStopId(route, direction);

        if (!stopId) {
            this.respond("Sorry - I can't get info for that route!");
        } else {
            console.log("StopId: " + stopId);

            var ctx = this;
            this.api.getRealTimeInfo(stopId)
                .then((response) => {

                    let duetime;
                    response.results.forEach((result) => {
                        if (!duetime || result.duetime < duetime) {
                            duetime = result.duetime;
                        }
                    });

                    ctx.api.getStopInfo(stopId)
                        .then((stopInfo) => {
                            ctx.respond("The next " + route + " from " + stopInfo.results[0].shortname + " is in " + duetime + " minutes");
                        })
                        .catch((err) => {
                            console.log(err);
                            ctx.respond("The next " + route + " is in " + duetime + " minutes");
                        });
                })
                .catch((err) => {
                    console.log(err);
                    ctx.respond("Woops!");
                });

        }

    }

    getStopId(route) {
        return this.favourites[route];
    }

    respond(msg) {
        console.log("Responding..." + msg);
        var responseData = {
            speech: msg
        }
        this.callback(null, responseData);
    }

}

module.exports = apiai_router;