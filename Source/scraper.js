const request = require('request');

var scrapeProxies = new Promise((resolve, reject) => {
    request({
        method: "GET",
        url: "http://www.proxyserverlist24.top/search?max-results=1",
    }, (error, response, body) => {
        if (!body) {
            var message = "Error scraping proxies, using proxies from proxies.txt";
            console.log(message);
            return reject(message);
        }
        var url = body.toString().match(/<meta content='(.+?)' itemprop='url'\/>/gi)[1].match(/'(.+?)'/)[1];
        request({
            method: "GET",
            url: url,
        }, (error, response, body) => {
            if (!body) {
                var message = "Error scraping proxies, using proxies from proxies.txt";
                console.log(message);
                return reject(message);
            }
            var fetched = body.toString().match(/(\d{1,3}\.){3}\d{1,3}:(\d+)/gi);
            if (!fetched) {
                var message = "Error scraping proxies, using proxies from proxies.txt";
                console.log(message);
                return reject(message);
            }
            return resolve(fetched);
        });
    });
});

module.exports = { scrapeProxies };