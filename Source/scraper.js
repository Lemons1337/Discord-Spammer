const request = require('request');

var scrapeProxies = new Promise((resolve, reject) => {
    request({
        method: "GET",
        url: "https://www.proxy-list.download/api/v1/get?type=http",
    }, (error, response, body) => {
        if (body) {
            return resolve(body.split("\n"));
        } else {
            return reject();
        }
    });
});

module.exports = { scrapeProxies };
