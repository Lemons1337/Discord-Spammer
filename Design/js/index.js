(function() {
    const toggler = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');

    const send = document.getElementsByClassName("send");
    const buttons = document.getElementsByClassName("method");
    const methods = document.getElementsByClassName("container");

    toggler.addEventListener('click', () => {
        toggler.classList.toggle('active');
        menu.classList.toggle('active');
    });

    window.onload = function() {
        switch (localStorage.method) {
            case "join":
                for (var i of methods) {
                    if (i.id === localStorage.method) {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
                break;

            case "leave":
                for (var i of methods) {
                    if (i.id === localStorage.method) {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
                break;

            case "spam":
                for (var i of methods) {
                    if (i.id === localStorage.method) {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
                break;

            case "dm":
                for (var i of methods) {
                    if (i.id === localStorage.method) {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
                break;

            default:
                for (var i of methods) {
                    if (i.id === "join") {
                        i.style.display = "block";
                    } else {
                        i.style.display = "none";
                    }
                }
                break;
        }
    }

    for (var f of buttons) {
        f.onclick = function() {
            var id = this.id.toLowerCase();
            for (var g of methods) {
                if (g.id === id) {
                    document.getElementById(id).style.display = "block";
                } else {
                    g.style.display = "none";
                }
            }
        }
    }

    for (var a of send) {
        a.onclick = function() {
            localStorage.method = this.id.split("-")[0];
            sendStart();
        }
    }

    function sendStart() {
        switch (localStorage.method) {
            case "join":
                var invite = document.getElementById('invite').value;
                $.ajax({
                    method: "GET",
                    url: `/join?invite=${invite}`,
                    success: function(body) {
                        var json = JSON.parse(body);
                        swal(json.title, json.message, json.type);
                    }
                });
                break;

            case "leave":
                var guild = document.getElementById('guild').value;
                $.ajax({
                    method: "GET",
                    url: `/leave?guild=${guild}`,
                    success: function(body) {
                        var json = JSON.parse(body);
                        swal(json.title, json.message, json.type);
                    }
                });
                break;

            case "spam":
                var channel = document.getElementById('channel').value;
                var message = document.getElementById('msg').value;
                var tts = document.getElementById('tts').value;
                if (tts && tts.checked) {
                    $.ajax({
                        method: "GET",
                        url: `/spam?channel=${channel}&message=${message}&tts=true`,
                        success: function(body) {
                            var json = JSON.parse(body);
                            swal(json.title, json.message, json.type);
                        }
                    });
                } else {
                    $.ajax({
                        method: "GET",
                        url: `/spam?channel=${channel}&message=${message}`,
                        success: function(body) {
                            var json = JSON.parse(body);
                            swal(json.title, json.message, json.type);
                        }
                    });
                }
                break;

            case "dm":
                var user = document.getElementById('user').value;
                var message = document.getElementById('message').value;
                $.ajax({
                    method: "GET",
                    url: `/dm?user=${user}&message=${message}`,
                    success: function(body) {
                        var json = JSON.parse(body);
                        swal(json.title, json.message, json.type);
                    }
                });
                break;
            
            case "friend":
                var user = document.getElementById('user2').value;
                $.ajax({
                    method: "GET",
                    url: `/friend?user=${user}`,
                    success: function(body) {
                        var json = JSON.parse(body);
                        swal(json.title, json.message, json.type);
                    }
                });
                break;

            default:
                swal('Invalid Method', 'Please pick a valid method!', 'error');
                break;
        }
    }

    setInterval(() => {
        $.ajax({
            method: "GET",
            url: '/stats',
            success: function(body) {
                var json = JSON.parse(body);
                document.getElementById('unverified').innerText = json.unverified;
                document.getElementById('verified').innerText = json.verified;
                document.getElementById('proxies').innerText = json.proxies;
            }
        });
    }, 1000);
    
})();