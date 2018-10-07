const request = require('request');

var scrapeProxies = new Promise((resolve, reject) => {
    request({
        method: "GET",
        url: "https://proxyscrape.com/proxies/HTTP_Working_Proxies.txt",
    }, (error, response, body) => {
        if (body) {
            return resolve(body);
        } else {
            return reject();
        }
    });
});

module.exports = { scrapeProxies };
