const proxyChecker = require('proxy-checker');
const express = require('express');
const request = require('request');
const fs = require('fs');
const app = express();

const { Bot } = require('./Source/spammer.js');
const { scrapeProxies } = require('./Source/scraper.js');
const config = require('./config.json');
const authTokens = fs.readFileSync('./tokens.txt', 'utf-8').replace(/\r|\"/gi, '').split("\n");

const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.setMaxListeners(Number.POSITIVE_INFINITY);

var tokens = [];
var proxies = [];
var verified = [];
var unverified = [];

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/Design'));

app.get('/', (req, res) => {
    return res.render('index', {
        unverified: unverified.length,
        verified: verified.length,
        proxies: proxies.length
    });
});

app.get('/stats', (req, res) => {
    var json = {};
    json.unverified = unverified.length;
    json.verified = verified.length;
    json.proxies = proxies.length;
    return res.end(JSON.stringify(json));
});

app.get('/join', (req, res) => {
    if (!req.query.invite) {
        var json = {};
        json.type = "error";
        json.title = "Invalid Invite";
        json.message = "Please specify a valid invite!";
        return res.end(JSON.stringify(json));
    } else {
        var invite = req.query.invite.toString().replace(/https:\/\/|http:\/\/|discord\.gg|discordapp\.com/gi, '');
        var json = {};
        json.type = "success";
        json.title = "Sent Bots To Join";
        json.message = `Sent ${tokens.length} bots to join ${invite}!`;
        if (config.console_output === true) console.log(json.message);
        var i = 0;
        var g = 0;
        setInterval(() => {
            if (i >= tokens.length) return;
            if (g >= proxies.length) g = 0;
            Bot.join(invite, tokens[i], proxies[g]);
            i++;
            g++;
        }, config.timeout);
        return res.end(JSON.stringify(json));
    }
});

app.get('/leave', (req, res) => {
    if (!req.query.guild || req.query.guild !== req.query.guild.replace(/[^0-9]/gi, '')) {
        var json = {};
        json.type = "error";
        json.title = "Invalid Guild ID";
        json.message = "Please specify a valid guild id!";
        return res.end(JSON.stringify(json));
    } else {
        var json = {};
        json.type = "success";
        json.title = "Sent Bots To Leave";
        json.message = `Sent ${tokens.length} bots to leave ${req.query.guild}!`;
        if (config.console_output === true) console.log(json.message);
        var i = 0;
        var g = 0;
        setInterval(() => {
            if (i >= tokens.length) return;
            if (g >= proxies.length) g = 0;
            Bot.leave(req.query.guild, tokens[i], proxies[g]);
            i++;
            g++;
        }, config.timeout);
        return res.end(JSON.stringify(json));
    }
});

app.get('/spam', (req, res) => {
    if (!req.query.channel || req.query.channel !== req.query.channel.replace(/[^0-9]/gi, '')) {
        var json = {};
        json.type = "error";
        json.title = "Invalid Channel ID";
        json.message = "Please specify a valid channel!";
        return res.end(JSON.stringify(json));
    } else if (!req.query.message) {
        var json = {};
        json.type = "error";
        json.title = "Invalid Message";
        json.message = "Please enter a valid message!";
        return res.end(JSON.stringify(json));
    } else {
        var json = {};
        json.type = "success";
        json.title = "Launched Spam";
        json.message = `Sent ${tokens.length} bots to spam ${req.query.channel} (message: "${req.query.message}" | tts: ${req.query.tts || false})!`;
        if (config.console_output === true) console.log(json.message);
        var i = 0;
        var g = 0;
        setInterval(() => {
            if (i >= tokens.length) return;
            if (g >= proxies.length) g = 0;
            Bot.spam(req.query.channel, req.query.message, req.query.tts || false, config.time * 1000, config.timeout, Date.now(), tokens[i], proxies[g]);
            i++;
            g++;
        }, config.time / 10);
        return res.end(JSON.stringify(json));
    }
});

app.get('/dm', (req, res) => {
    if (!req.query.user || req.query.user !== req.query.user.replace(/[^0-9]/gi, '')) {
        var json = {};
        json.type = "error";
        json.title = "Invalid ID";
        json.message = "Please specify a valid user id!";
        return res.end(JSON.stringify(json));
    } else if (!req.query.message) {
        var json = {};
        json.type = "error";
        json.title = "Invalid Message";
        json.message = "Please enter a valid message!";
        return res.end(JSON.stringify(json));
    } else {
        var json = {};
        json.type = "success";
        json.title = "Launched DM Spam";
        json.message = `Sent ${tokens.length} bots to dm spam ${req.query.user} with (message: "${req.query.message}")!`;
        if (config.console_output === true) console.log(json.message);
        var i = 0;
        var g = 0;
        setInterval(() => {
            if (i >= tokens.length) return;
            if (g >= proxies.length) g = 0;
            Bot.dm(req.query.user, req.query.message, config.time * 1000, config.timeout, Date.now(), tokens[i], proxies[g]);
            i++;
            g++;
        }, config.time / 10);
        return res.end(JSON.stringify(json));
    }
});

app.get('/friend', (req, res) => {
    if (!req.query.user || req.query.user !== req.query.user.replace(/[^0-9]/gi, '')) {
        var json = {};
        json.type = "error";
        json.title = "Invalid User ID";
        json.message = "Please specify a valid user!";
        return res.end(JSON.stringify(json));
    } else {
        var json = {};
        json.type = "success";
        json.title = "Friend Requests Sent";
        json.message = `Sent ${tokens.length} bots to friend request ${req.query.user}!`;
        if (config.console_output === true) console.log(json.message);
        var i = 0;
        var g = 0;
        setInterval(() => {
            if (i >= tokens.length) return;
            if (g >= proxies.length) g = 0;
            Bot.friend(req.query.user, tokens[i], proxies[g]);
            i++;
            g++;
        }, config.timeout);
        return res.end(JSON.stringify(json));
    }
});

scrapeProxies.then(fetched => {
    if (fetched.length > config.max_proxies) {
        fetched.splice(config.max_proxies - fetched.length);
    }
    fs.writeFile('Source/proxies.txt', fetched.join("\n"), (err) => {
        if (err) throw err;
        proxyChecker.checkProxiesFromFile('Source/proxies.txt', {
            url: 'http://www.example.com',
        }, (host, port, ok, statusCode, err) => {
            if (ok) proxies.push(`${host}:${port}`);
        });
    });
    console.log(`Checking ${fetched.length} proxies!`);
}).catch(err => {
    proxyChecker.checkProxiesFromFile('Source/proxies.txt', {
        url: 'http://www.example.com',
    }, (host, port, ok, statusCode, err) => {
        if (ok) proxies.push(`${host}:${port}`);
    });
    console.log(`Checking proxies from proxies.txt!`);
});

var t = -1;
setInterval(() => {
    if (t >= authTokens.length) return;
    request({
        method: "GET",
        url: "https://discordapp.com/api/v7/users/@me",
        headers: {
            authorization: authTokens[t++]
        }
    }, (error, response, body) => {
        if (!body) return;
        var json = JSON.parse(body);
        if (json && json.id) {
            if (json.verified) {
                verified.push(authTokens[t]);
            } else {
                unverified.push(authTokens[t]);
            }
            tokens.push(authTokens[t]);
        }
    });
}, 100);

process.on('uncaughtException', (err) => {});

app.listen(config.port, () => {
    console.log(`Started Discord Spammer on port ${config.port}`);
    console.log(`Checking ${authTokens.length} tokens!`);
});
