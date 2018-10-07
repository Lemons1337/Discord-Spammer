const request = require('request');

class Join {
    constructor(invite, token, proxy) {
        this.invite = invite;
        this.token = token;
        this.proxy = proxy;
    }
    send() {
        request({
            method: "POST",
            url: `https://discordapp.com/api/v7/invite/${this.invite}`,
            json: false,
            proxy: `http://${this.proxy}`,
            headers: {
                authorization: this.token
            }
        }, (error, response, body) => {});
    }
}

class Leave {
    constructor(guild, token, proxy) {
        this.guild = guild;
        this.token = token;
        this.proxy = proxy;
    }
    send() {
        request({
            method: "DELETE",
            url: `https://discordapp.com/api/v7/users/@me/guilds/${this.guild}`,
            json: false,
            proxy: `http://${this.proxy}`,
            headers: {
                authorization: this.token
            }
        }, (error, response, body) => {});
    }
}

class Spam {
    constructor(channel, message, tts, time, timeout, date, token, proxy) {
        this.channel = channel;
        this.message = message;
        this.tts = tts;
        this.token = token;
        this.time = time;
        this.timeout = timeout;
        this.date = date;
        this.proxy = proxy;
    }
    send() {
        setInterval(() => {
            if (this.date + this.time < Date.now()) return;
            request({
                method: "POST",
                url: `https://discordapp.com/api/v7/channels/${this.channel}/messages`,
                json: true,
                proxy: `http://${this.proxy}`,
                headers: {
                    'content-type': 'application/json',
                    authorization: this.token
                },
                body: {
                    "content": this.message,
                    "tts": this.tts
                }
            }, (error, response, body) => {});
        }, this.timeout);
    }
}

class DM {
    constructor(user, message, time, timeout, date, token, proxy) {
        this.user = user;
        this.message = message;
        this.time = time;
        this.timeout = timeout;
        this.date = date;
        this.token = token;
        this.proxy = proxy;
    }
    send() {
        setInterval(() => {
            if (this.date + this.time < Date.now()) return;
            request({
                method: "PATCH",
                url: "https://discordapp.com/api/v7/users/@me",
                json: true,
                proxy: `http://${this.proxy}`,
                headers: {
                    'content-type': 'application/json',
                    authorization: this.token
                },
                body: {}
            }, (error, response, body) => {
                if (!response || !body || !body.id) return;
                this.json = body;
                this.id = this.json.id;
                request({
                    method: "POST",
                    url: `https://discordapp.com/api/v7/users/${this.id}/channels`,
                    json: true,
                    proxy: `http://${this.proxy}`,
                    headers: {
                        'content-type': 'application/json',
                        authorization: this.token
                    },
                    body: {
                        recipients: [this.user]
                    }
                }, (error, response, body) => {
                    if (!response || !body) return;
                    this.json = body;
                    this.channel = this.json.id;
                    request({
                        method: "POST",
                        url: `https://discordapp.com/api/v7/channels/${this.channel}/messages`,
                        json: true,
                        proxy: `http://${this.proxy}`,
                        headers: {
                            'content-type': 'application/json',
                            authorization: this.token
                        },
                        body: {
                            "content": this.message
                        },
                    }, (error, response, body) => {});
                });
            });
        }, this.timeout);
    }
}

class Friend {
    constructor(user, token, proxy) {
        this.user = user;
        this.token = token;
        this.proxy = proxy;
    }
    send() {
        request({
            method: "PUT",
            url: `https://discordapp.com/api/v7/users/@me/relationships/${this.user}`,
            json: true,
            proxy: `http://${this.proxy}`,
            headers: {
                'content-type': 'application/json',
                authorization: this.token
            },
            body: {}
        }, (error, response, body) => {});
    }
}

const Bot = {
    join: function(invite, token, proxy) {
        new Join(invite, token, proxy).send();
    },
    leave: function(guild, token, proxy) {
        new Leave(guild, token, proxy).send();
    },
    spam: function(channel, message, tts, time, date, token, proxy) {
        new Spam(channel, message, tts, time, date, token, proxy).send();
    },
    dm: function(user, message, time, timeout, date, token, proxy) {
        new DM(user, message, time, timeout, date, token, proxy).send();
    },
    friend: function(user, token, proxy) {
        new Friend(user, token, proxy).send();
    }
}

module.exports = { Bot };